import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';
import Api from '../../services/Api'
import { isCodeValid, isNameValid } from '../../validators/Validator'
import Localization from "../Localization";

function renderProductsTable(categories, suppliers, handleRowAdd, handleRowUpdate, iserror, errorMessages) {
    const columns =
        [
            { title: "id", field: "id", hidden: true },
            {
                title: 'Descrição', field: 'description', type: 'string',
                validate: rowData => ((rowData.description != null && isNameValid(rowData.description))
                    ? true : '⚠️ Descrição deve ter entre 5 e 50 caracteres.')
            },
            {
                title: 'Código', field: 'code', type: 'string',
                validate: rowData => ((rowData.code != null && isCodeValid(rowData.code))
                    ? true : '⚠️ Código deve ter entre 9 e 13 dígitos.')
            },
            {
                title: 'Compra', field: 'purchasePrice', type: 'currency',
                validate: rowData => ((rowData.purchasePrice != null && rowData.purchasePrice > 0)
                    ? true : '⚠️ Preço de compra deve ser maior que zero.')
            },
            {
                title: 'Venda', field: 'salePrice', type: 'currency',
                validate: rowData => ((rowData.salePrice != null && rowData.salePrice > 0)
                    ? true : '⚠️ Preço de venda deve ser maior que zero.')
            },
            {
                title: 'Lucro', field: 'profit', type: 'currency', editable: 'never',
                validate: rowData => ((rowData.salePrice != null && rowData.salePrice > 0)
                    ? true : '⚠️ Lucro de venda deve ser maior que zero.')
            },
            {
                title: 'Quantidade', field: 'quantity', type: 'numeric',
                validate: rowData => ((rowData.quantity != null && rowData.quantity > 0)
                    ? true : '⚠️ Quantidade deve ser maior que zero.')
            },
            {
                title: 'Quantidade Mínima', field: 'minimumQuantity', type: 'numeric',
                validate: rowData => ((rowData.minimumQuantity != null && rowData.minimumQuantity > 0)
                    ? true : '⚠️ Quantidade mínima deve ser maior que zero.')
            },
            {
                title: 'Desconto', field: 'discount', type: 'numeric',
                validate: rowData => ((rowData.discount != null && rowData.discount >= 0 && rowData.discount < 100)
                    ? true : '⚠️ Desconto deve estar entre 0 e 100.')
            },
            {
                title: 'Categoria', field: 'categoryId', lookup: categories,
                validate: rowData => ((rowData.categoryId != null)
                    ? true : '⚠️ Produto deve ter categoria.')
            },
            {
                title: 'Fornecedor', field: 'supplierId', lookup: suppliers,
                validate: rowData => ((rowData.supplierId != null)
                    ? true : '⚠️ Produto deve ter fornecedor.')
            }
        ];

 
    const operations = (query, data) => {
        //Searching
        data = data.filter(p =>
            p.description.toLowerCase().includes(query.search.toLowerCase()) ||
            p.code.includes(query.search) ||
            p.quantity.toString().includes(query.search) ||
            p.purchasePrice.toString().includes(query.search) ||
            p.salePrice.toString().includes(query.search) ||
            p.discount.toString().includes(query.search) ||
            p.profit.toString().includes(query.search)

        );
        //Sorting 
        if (query.orderBy != null) {
            let orderBy = query.orderBy.field;
            data.sort(function (a, b) {
                if (b[orderBy] < a[orderBy]) {
                    return -1;
                }
                if (b[orderBy] > a[orderBy]) {
                    return 1;
                }
                return 0;
            });
        }
        return data;
    };

    return (
        <>
            <div>
                {iserror &&
                    <Alert
                        severity="error">
                        {errorMessages.map((msg, i) => {
                            return <div key={i}>{msg}</div>
                        })}
                    </Alert>
                }
            </div>
            <MaterialTable
                title="Produtos"
                columns={columns}
                localization={Localization}
                options={{
                    exportButton: true,
                    headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF'
                    }
                }}
                data={query =>
                    new Promise((resolve, reject) => {
                        new Api('Product?').Get(query.pageSize, query.page)
                            .then(result => {
                                result.data = result.data.map((p) => { p.profit = p.salePrice - p.purchasePrice; return p; });
                                return result;
                            })
                            .then(result => {
                                resolve({
                                    data: operations(query, result.data),
                                    page: result.page - 1,
                                    totalCount: result.total
                                })
                            })
                    })
                }
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve) => {
                            handleRowAdd(newData, resolve)
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            handleRowUpdate(newData, oldData, resolve);
                        }),
                }}
            />
        </>
    )
};



function Product() {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState({});
    const [suppliers, setSuppliers] = useState({});
    const [errorMessages, setErrorMessages] = useState([]);
    const [iserror, setIserror] = useState(false);

    useEffect(() => {
        new Api('Category?').Get()
            .then(pagination => {
                let entities = pagination.data.reduce((result, category) => {
                    result[category.id] = category.title;
                    return result;
                }, {});

                setCategories(entities)
            }).catch(err => console.log(err));

        new Api('Supplier?').Get()
            .then(pagination => {
                let entities = pagination.data.reduce((result, suppliers) => {
                    result[suppliers.id] = suppliers.name;
                    return result;
                }, {});
                setSuppliers(entities)
            }).catch(err => console.log(err));

    }, [])


    const handleRowAdd = (newData, resolve) => {
        newData.categoryId = Number(newData.categoryId);
        newData.supplierId = Number(newData.supplierId);

        new Api('Product').Post(newData)
            .then(product => {
                let dataToAdd = [...data];
                dataToAdd.push(product);
                setData(dataToAdd);
                resolve()
                setErrorMessages([])
                setIserror(false)
            })
            .catch(error => {
                setErrorMessages([`Não foi possível enviar os dados ao servidor. ${error}`])
                setIserror(true)
                resolve()
            })

    }

    const handleRowUpdate = (newData, oldData, resolve) => {
        newData.categoryId = Number(newData.categoryId);
        newData.supplierId = Number(newData.supplierId);

        new Api('Product').Put(newData).then(product => {
            const dataUpdate = [...data];
            const index = oldData.tableData.id;
            dataUpdate[index] = product;
            setData([...dataUpdate]);
            resolve()
            setIserror(false)
            setErrorMessages([])
        })
            .catch(error => {
                setErrorMessages(["Não foi possível atualizar o produto. Erro no servidor."])
                setIserror(true)
                resolve()
            })

    }

    return (renderProductsTable(categories, suppliers, handleRowAdd, handleRowUpdate, iserror, errorMessages));

};

export default Product;