import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';

import { TableItem } from './TableItem';
import { TabItem } from './TabItem';

const baseURL = "api/Order";

const isOk = (response) => {
    if (response !== null && response.ok) {
        return response;
    } else {
        throw Error(response.status);
    }
}


export default function Sale(props) {
    const [errorMessages, setErrorMessages] = useState('');
    const [successMessages, setSuccessMessages] = useState('');
    const [iserror, setIserror] = useState(false);
    const [ismessage, setIsmessage] = useState(false);
    const [products, setProducts] = useState([]);
    const clientId = props.match.params.clientId;

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }));

    const onAdd = (product) => {
        setProducts([...products, product]);
    }

    const handleSaveItems = () => {
        if (products.length === 0) {
            setErrorMessages(`Erro. Pedido deve ter ao menos um item.`);
            setIserror(true);
        } else {
            let order = {
                clientId: Number(clientId),
                items: products.map(p => ({ 'ProductId': Number(p.productid), 'Quantity': Number(p.quantity) }))
            }
            fetch(baseURL, {
                method: 'Post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(order)
            })
                .then(response => isOk(response))
                .then(response => response.json())
                .then(result => {                    
                    setProducts([]);
                    setErrorMessages([]);
                    setSuccessMessages(`Pedido registrado com sucesso!. ${result.status}`);
                    setIserror(false);
                    setIsmessage(true);
                }).catch(error => {
                    setErrorMessages(`Não foi possível enviar os dados para o servidor. ${error}`);
                    setIserror(true);
                });
        }

    }
    const handleRowUpdate = (newData, oldData, resolve) => {
        let objIndex = products.findIndex(p => p.code === oldData.code);
        let productscopy = [...products];
        productscopy[objIndex] = newData;
        setProducts(productscopy);
        resolve();
    }

    const handleRowDelete = (oldData, resolve) => {
        let newproducts = products.filter(p => p.code !== oldData.code);
        setProducts(newproducts);
        resolve();
    }

    const classes = useStyles();
    return (<>
        <div>
            {iserror &&
                <Alert severity="error">{errorMessages}</Alert>
            }
            {ismessage &&
                <Alert severity="success">{successMessages}</Alert>
            }

        </div>
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <TableItem products={products}
                        onRowUpdate={handleRowUpdate}
                        onRowDelete={handleRowDelete}
                        onSaveItems={handleSaveItems}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TabItem onAdd={onAdd} />
                </Grid>
            </Grid>
        </div>
    </>
    );

};



