import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';

let URL = 'https://estoquapp.herokuapp.com/api/Product';

function renderProductsTable(categories, suppliers, handleRowAdd, handleRowUpdate, iserror, errorMessages) {
    const columns =
        [
            { title: "id", field: "id", hidden: true },
            {
                title: 'Descrição', field: 'description', type: 'string',
                validate: rowData => ((rowData.description != null && rowData.description.length >= 5 && rowData.description.length <= 50)
                    ? true : '⚠️ Descrição deve ter entre 5 e 50 caracteres.')
            },
            {
                title: 'Código', field: 'code', type: 'string', editable: 'never',
                validate: rowData => ((rowData.code != null && rowData.code.length >= 9 && rowData.code.length <= 13)
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

    const localization = {
        body: {
            emptyDataSourceMessage: 'Nenhum registro para exibir',
            addTooltip: 'Adicionar',
            deleteTooltip: 'Apagar',
            editTooltip: 'Editar',
            editRow: {
                deleteText: 'Voulez-vous supprimer cette ligne?',
                cancelTooltip: 'Cancelar',
                saveTooltip: 'Salvar'
            }
        },
        toolbar: {
            searchTooltip: 'Pesquisar',
            searchPlaceholder: 'Pesquisar',
            exportTitle: 'Exportar',
            exportAriaLabel: 'Exportar',
        },
        pagination: {
            labelRowsSelect: 'linhas',
            labelDisplayedRows: '{count} de {from}-{to}',
            firstTooltip: 'Primeira página',
            previousTooltip: 'Página anterior',
            nextTooltip: 'Próxima página',
            lastTooltip: 'Última página'
        },
        header: {
            actions: 'Ações'
        }
    }

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
                localization={localization}
                options={{
                    exportButton: true,
                    headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF'
                    }
                }}
                data={query =>
                    new Promise((resolve, reject) => {                        
                        URL += '?per_page=' + query.pageSize
                        URL += '&page=' + (query.page + 1)
                        fetch(URL)
                            .then(response => response.json())
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
                            }).catch(err => console.log(err))
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
    const [suppliers, setsuppliers] = useState({});
    const [errorMessages, setErrorMessages] = useState([]);
    const [iserror, setIserror] = useState(false);

    const isOk = (response) => {
        if (response !== null && response.ok) {
            return response;
        } else {
            console.log(response)
            let resp = response.json();
            console.log(resp.erros);
            throw new Error(response.statusText);
        }
    }

    useEffect(() => {
        fetch('/api/Category/All')
            .then(res => isOk(res))
            .then(response => response.json())
            .then(data => {
                data = data.reduce((result, category) => {
                    result[category.id] = category.title;
                    return result;
                }, {});
                setCategories(data)
            }).catch(err => console.log(err));

        fetch('/api/Supplier/All')
            .then(res => isOk(res))
            .then(response => response.json())
            .then(data => {
                data = data.reduce((result, suppliers) => {
                    result[suppliers.id] = suppliers.name;
                    return result;
                }, {});
                setsuppliers(data)
            }).catch(err => console.log(err));

    }, [])


    const handleRowAdd = (newData, resolve) => {
        newData.categoryId = Number(newData.categoryId);
        newData.supplierId = Number(newData.supplierId);

        fetch(URL, {
            method: 'Post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(newData)
        })
            .then(res => isOk(res))
            .then(response => response.json())
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
        fetch(URL,
            {
                method: 'Put',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(newData)
            })
            .then(res => isOk(res))
            .then(response => response.json())
            .then(product => {
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