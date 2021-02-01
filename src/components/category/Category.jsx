import React, { useState } from 'react';
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';
import Api from '../../services/Api'
import { isTitleValid } from '../../validators/Validator'



function renderProductsTable(handleRowAdd, handleRowUpdate, iserror, errorMessages) {
    const columns =
        [
            { title: "id", field: "id", hidden: true },
            {
                title: 'Título', field: 'title', type: 'string',
                validate: rowData => ((rowData.title != null && isTitleValid(rowData.title)) ?
                    true : '⚠️ Título deve ter entre 5 e 25 caracteres')
            },
            {
                title: 'Desconto', field: 'discount', type: 'numeric',
                validate: rowData => ((rowData.discount != null && rowData.discount >= 0 && rowData.discount < 100) ?
                    true : '⚠️ Desconto deve ser >= 0 e <100')
            },
        ];

    const localization = {
        header: {
            actions: 'Ações'
        },
        grouping: {
            placeholder: "Tirer l'entête ...",
            groupedBy: 'Agroupar por:'
        },
        body: {
            emptyDataSourceMessage: 'Nenhum registro para exibir',
            addTooltip: 'Adicionar',
            deleteTooltip: 'Apagar',
            editTooltip: 'Editar',
            filterRow: {
                filterTooltip: 'Filtrar'
            },
            editRow: {
                deleteText: 'Voulez-vous supprimer cette ligne?',
                cancelTooltip: 'Cancelar',
                saveTooltip: 'Salvar'
            }
        },
        toolbar: {
            addRemoveColumns: 'Ajouter ou supprimer des colonnes',
            nRowsSelected: '{0} Linha(s) selecionada(s)',
            showColumnsTitle: 'Ver as colunas',
            showColumnsAriaLabel: 'Ver as colunas',
            searchTooltip: 'Pesquisar',
            searchPlaceholder: 'Pesquisar',
            exportTitle: 'Exportar',
            exportAriaLabel: 'Exportar',

        },
        pagination: {
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsSelect: 'Linhas',
            labelRowsPerPage: 'Linhas por página:',
            firstAriaLabel: 'Primeira página',
            firstTooltip: 'Primeira página',
            previousAriaLabel: 'Página anterior',
            previousTooltip: 'Página anterior',
            nextAriaLabel: 'Próxima página',
            nextTooltip: 'Próxima página',
            lastAriaLabel: 'Última página',
            lastTooltip: 'Última página'
        }

    }

    const operations = (query, data) => {
        //Searching
        data = data.filter(p => p.title.toLowerCase().includes(query.search.toLowerCase()))
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
                title="Categorias"
                columns={columns}
                localization={localization}
                options={{
                    sorting: true,
                    exportButton: true,
                    headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF'
                    }
                }}
                data={query =>
                    new Promise((resolve, reject) => {
                        new Api('Category').Get(query.pageSize, query.page)
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



function Category() {

    const [data, setData] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const [iserror, setIserror] = useState(false);

    const handleRowAdd = (newData, resolve) => {
        new Api('Category').Post(newData)
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
        let api = new Api('Category');
        api.Put(newData)
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

    return (renderProductsTable(handleRowAdd, handleRowUpdate, iserror, errorMessages));

};

export default Category;