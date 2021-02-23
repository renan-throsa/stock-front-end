import React from 'react';
import MaterialTable from 'material-table';
import Api from '../../services/Api'

export default function OnProducts() {

    const columns =
        [
            { title: "id", field: "id", hidden: true },
            {
                title: 'Descrição', field: 'description', type: 'string'

            },
            {
                title: 'Código', field: 'code', type: 'string', editable: 'never'

            },
            {
                title: 'Compra', field: 'purchasePrice', type: 'currency'
            },
            {
                title: 'Venda', field: 'salePrice', type: 'currency'
            },
            {
                title: 'Lucro', field: 'profit', type: 'currency'
            },
            {
                title: 'Quantidade', field: 'quantity', type: 'numeric'
            },
            {
                title: 'Quantidade Mínima', field: 'minimumQuantity', type: 'numeric',
            },
            {
                title: 'Desconto', field: 'discount', type: 'numeric'
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

        <MaterialTable
            title="Sugestão de compra"
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
                    new Api('Product?RunningLow=true')
                        .Get(query.pageSize, query.page).then(result => {
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
        />

    )

};

