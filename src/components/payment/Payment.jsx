import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OrdersTable from './OrdersTable';
import PaymentPanel from './PaymentPanel'
import Grid from '@material-ui/core/Grid';

export default function Payment() {

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