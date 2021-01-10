import React from 'react';
import MaterialTable from 'material-table';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';

const baseURL = "https://estoquapp.herokuapp.com/api";
export default function OnClients(props) {
    const columns =
        [
            { title: "id", field: "id", hidden: true },
            {
                title: 'Nome', field: 'name', type: 'string',
                validate: (rowData) => ((rowData.name != null && rowData.name.length >= 10 && rowData.name.length <= 50)
                    ? true : '⚠️ Nome deve ter entre 10 e 50 caracteres.')
            },
            {
                title: 'Endereço', field: 'address', type: 'string',
                validate: rowData => ((rowData.address != null && rowData.address.length >= 10 && rowData.address.length <= 100)
                    ? true : '⚠️ Endereço deve ter entre 10 e 100 caracteres.')
            },
            {
                title: 'Telefone', field: 'phoneNumber', type: 'string',
                validate: rowData => ((rowData.phoneNumber != null && rowData.phoneNumber.length === 11)
                    ? true : '⚠️ Número de telefone deve ter 11 dígitos.')
            },
            {
                title: 'Status', field: 'status', lookup: { 0: 'Inativo', 1: 'Ativo' }, editable: 'never'
            },
            {
                title: 'Débito', field: 'debt', type: 'currency', editable: 'never'
            },
            {
                title: 'Última compra', field: 'lastPurchase', type: 'date', editable: 'never'
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
        data = data.filter(p =>
            p.name.toLowerCase().includes(query.search.toLowerCase()) ||
            p.address.toLowerCase().includes(query.search.toLowerCase()) ||
            p.phoneNumber.includes(query.search)
        )
        //Sorting 
        if (query.orderBy != null) {
            let field = query.orderBy.field;
            data.sort(function (a, b) {
                if (a[field] > b[field]) {
                    return 1;
                }
                if (a[field] < b[field]) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }
        return data;
    };

    return (

        <MaterialTable
            title="Clientes inativos"
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
                    let url = baseURL+ '/Client/Inactive?'
                    url += 'per_page=' + query.pageSize
                    url += '&page=' + (query.page + 1)
                    fetch(url)
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
            actions={[
                {
                    icon: () => <AddShoppingCartIcon />,
                    tooltip: 'Nova venda',
                    onClick: (event, rowData) => props.history.push(`/sale/client/${rowData.id}`)
                }
                , {
                    icon: () => <PaymentIcon />,
                    tooltip: 'Pagar',
                    onClick: (event, rowData) =>
                        props
                            .history
                            .push(`/payment/client/${rowData.id}`)
                }
            ]}
        />

    )

};

