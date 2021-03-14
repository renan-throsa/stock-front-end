import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Api from '../../services/Api'

import { StyledTableCell, StyledTableRow, useStyles } from './styles'



export default function Items(props) {
    const classes = useStyles();
    const [items, setItems] = useState([]);

    useEffect(() => {

        /*The last line with an array is necessary or You'll get a
         * 'React Hook useEffect has a missing dependency: 'props.orderId'.
         * Either include it or remove the dependency array.'*/
        let api = new Api(`Order/${props.orderId}/Item?`);
        api.Get().then(data => { setItems(data) })

    }, [props.orderId]);

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Produto</StyledTableCell>
                        <StyledTableCell align="right">Quantidade</StyledTableCell>
                        <StyledTableCell align="right">Preço</StyledTableCell>
                        <StyledTableCell align="right">Desconto</StyledTableCell>
                        <StyledTableCell align="right">Subtotal</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
                        <StyledTableRow key={item.id}>
                            <StyledTableCell component="th" scope="row">
                                {item.product.description}
                            </StyledTableCell>
                            <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                            <StyledTableCell align="right">{item.value}</StyledTableCell>
                            <StyledTableCell align="right">{item.discound}</StyledTableCell>
                            <StyledTableCell align="right">{item.value * item.quantity}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
