import React from 'react';
import MaterialTable from 'material-table';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';
import Api from '../../services/Api'
import Loacalization from '../Localization'

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
            localization={Loacalization}
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
                    let api = new Api('Client?Status=0');
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

