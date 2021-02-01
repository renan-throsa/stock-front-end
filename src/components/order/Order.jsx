import React from 'react';
import MaterialTable from 'material-table';
import PaymentIcon from '@material-ui/icons/Payment';
import Items from './Items';
import Api from '../../services/Api'

const columns =
    [
        { title: "id", field: "id", hidden: true },
        { title: "cLientId", field: "cLientId", hidden: true },
        {
            title: 'Cliente', field: 'client.name', type: 'string'
        },
        {
            title: 'Valor', field: 'value', type: 'currency'
        },
        {
            title: 'Status', field: 'status', type: 'numeric',
            lookup: { 0: 'Pago', 1: 'Pendende' }
        },
        {
            title: 'Data', field: 'date', type: 'date'
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
    data = data.filter(o =>
        o.client.name.toLowerCase().includes(query.search.toLowerCase()) ||
        o.value.toString().includes(query.search) ||
        new Date(o.date).toLocaleDateString().includes(query.search)
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

export default function Order(props) {

    return (
        <MaterialTable
            title="Pedidos"
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
                    let api = new Api('Order');
                    api.Get(query)
                        .then(result => {
                            resolve({
                                data: operations(query, result.data),
                                page: result.page - 1,
                                totalCount: result.total
                            })
                        })
                })
            }
            actions={[
                {
                    icon: () => <PaymentIcon />,
                    tooltip: 'Pagar',
                    onClick: (event, rowData) =>
                        props
                            .history
                            .push(`/payment/client/${rowData.cLientId}`)
                }
            ]}
            detailPanel={rowData => {
                return (
                    <Items orderId={rowData.id} />
                )
            }}
        />

    )
};

