import React from 'react';
import MaterialTable from 'material-table';

const URL = "https://estoquapp.herokuapp.com/api/Payment?";

const columns =
    [
        { title: "id", field: "id", hidden: true },
        {
            title: 'Cliente', field: 'client.name', type: 'string', editable: 'never'
        },
        {
            title: 'Valor', field: 'amount', type: 'currency', editable: 'never'
        },
        {
            title: 'Data', field: 'date', type: 'date', editable: 'never'
        },
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
        p.client.name.toLowerCase().includes(query.search.toLowerCase()) ||
        p.amount.toString().includes(query.search) ||
        new Date(p.date).toLocaleDateString().includes(query.search)
    )
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

export default function Client(props) {
    return (
        <MaterialTable
            title="Pagamentos"
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
                    URL += 'per_page=' + query.pageSize
                    URL += '&page=' + (query.page + 1)
                    fetch(URL)
                        .then(response => response.json())
                        .then(result => {
                            resolve({
                                data: operations(query, result.data),
                                page: result.page - 1,
                                totalCount: result.total
                            })
                        }).catch(err => console.log(err))
                })
            }
        />
    )
};

