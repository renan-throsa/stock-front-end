import React, { useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#01579b',
        color: '#FFF'
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);


const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const isOk = (response) => {
    if (response !== null && response.ok) {
        return response;
    } else {
        throw Error(response.status);
    }
}
export default function Items(props) {
    const classes = useStyles();
    const [items, setItems] = React.useState([]);

    useEffect(() => {
    /*The last line with an array is necessary or You'll get a
     * 'React Hook useEffect has a missing dependency: 'props.orderId'.
     * Either include it or remove the dependency array.'*/
        fetch(`/api/Item/${props.orderId}`)
            .then(res => isOk(res))
            .then(response => response.json())
            .then(data => { setItems(data) })
            .catch(err => console.log(err));
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
