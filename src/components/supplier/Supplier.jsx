import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';
import Api from '../../services/Api'
import { isPhoneNumberValid, isNameValid, isEmailValid } from '../../validators/Validator'

function renderProductsTable(handleRowAdd, handleRowUpdate, iserror, errorMessages) {
    const columns =
        [
            { title: "id", field: "id", hidden: true },
            {
                title: 'Nome', field: 'name', type: 'string',
                validate: rowData => ((rowData.name != null && isNameValid(rowData.name))
                    ? true : '⚠️ Nome deve ter entre 5 e 50 caracteres.')
            },
            {
                title: 'Email', field: 'email', type: 'string',
                validate: rowData => ((rowData.email != null && isEmailValid(rowData.email))
                    ? true : '⚠️ Email deve ter entre 5 e 50 caracteres.')
            },
            {
                title: 'Telefone', field: 'phoneNumber', type: 'string',
                validate: rowData => ((rowData.phoneNumber != null && isPhoneNumberValid(rowData.phoneNumber))
                    ? true : '⚠️ Número de telefone deve ter 11 dígitos.')
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
            p.name.toLowerCase().includes(query.search.toLowerCase()) ||
            p.email.toLowerCase().includes(query.search.toLowerCase()) ||
            p.phoneNumber.includes(query.search)
        );
        //Sorting 
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
                title="Fornecedores"
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
                        let api = new Api('Supplier?');
                        api.Get(query.pageSize, query.page)
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



function Supplier() {

    const [data, setData] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const [iserror, setIserror] = useState(false);


    const handleRowAdd = (newData, resolve) => {
        new Api('Supplier').Post(newData)
            .then(supplier => {
                let dataToAdd = [...data];
                dataToAdd.push(supplier);
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
        new Api('Supplier').Put(newData)
            .then(supplier => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = supplier;
                setData([...dataUpdate]);
                resolve()
                setIserror(false)
                setErrorMessages([])
            })
            .catch(error => {
                setErrorMessages(["Não foi possível atualizar o fornecedor. Erro no servidor."])
                setIserror(true)
                resolve()
            })


    }

    return (renderProductsTable(handleRowAdd, handleRowUpdate, iserror, errorMessages));

};

export default Supplier;