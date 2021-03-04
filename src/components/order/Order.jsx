import React from 'react';
import MaterialTable from 'material-table';
import PaymentIcon from '@material-ui/icons/Payment';
import Localization from "../Localization";
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
                    let api = new Api('Order?OrderBy=status desc');
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

