import React from 'react';
import MaterialTable from 'material-table';
import Api from '../../services/Api'
import Localization from "../Localization";

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

export default function Payments() {
    return (
        <MaterialTable
            title="Pagamentos"
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
                    let api = new Api('Payment?');
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
        />
    )
};

