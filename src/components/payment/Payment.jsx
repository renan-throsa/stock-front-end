import React from 'react';
import OrdersTable from './OrdersTable';
import PaymentPanel from './PaymentPanel'
import Grid from '@material-ui/core/Grid';
import { useStyles } from './styles'

export default function Payment() {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <OrdersTable />
                </Grid>
                <Grid item xs={4}>
                    <PaymentPanel />
                </Grid>
            </Grid>
        </div>

    );

}