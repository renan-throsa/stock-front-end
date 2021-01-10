import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useSelectStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '40ch',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const useInputStyles = makeStyles((theme) => ({
    text: {
        '& > *': {
            margin: theme.spacing(1),
            width: '40ch',
        },
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export function ManualTabPanel(props) {
    const [disabled, setDisabled] = useState(true);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = React.useState([]);
    const [currentCategory, setcurrentCategory] = useState('');
    const [currentProduct, setcurrentProduct] = React.useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quantityAvailable, setQuantityAvailable] = useState('');
    const [quantityerror, setQuantityErrors] = useState({ quantity: { valid: true, text: "" } });

    const handleCategoryChange = (event) => {
        let categoryId = event.target.value;
        setcurrentCategory(categoryId)
        fetch(`api/Product/ByCategory?id=${categoryId}`)
            .then(res => isOk(res))
            .then(response => response.json())
            .then(data => { setProducts(data) })
            .catch(err => console.log(err));
    };

    const handleProductChange = (event) => {
        let productId = event.target.value;
        setcurrentProduct(productId)
        let p = products.find(p => p.id === productId);
        setPrice(p.salePrice);
        setQuantityAvailable(p.quantity);
    };

    const selectStyles = useSelectStyles();
    const inputStyles = useInputStyles();

    const onSubmit = (event) => {
        event.preventDefault();
        let p = products.find(p => p.id === currentProduct)
        let productid = p.id;
        let description = p.description;
        setcurrentProduct('')
        setPrice('');
        setQuantity('');
        setQuantityAvailable('');
        props.onAdd({ productid, description, price, quantity, subtotal: price * quantity });
    }

    const isOk = (response) => {
        if (response !== null && response.ok) {
            return response;
        } else {
            throw new Error(response.statusText);
        }
    }

    useEffect(() => {
        fetch('/api/Category/All')
            .then(res => isOk(res))
            .then(response => response.json())
            .then(data => { setCategories(data) })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        /*React Hook useEffect contains a call to 'setDisabled'.
         * Without a list of dependencies, this can lead to an infinite chain of updates. To fix this, 
         * pass [currentCategory.length, currentProduct.length, quantity, quantityAvailable] as a second 
         * argument to the useEffect Hook  react-hooks/exhaustive-deps*/
        if (currentCategory.length === 0 || currentProduct.length === 0 || quantity <= 0 || quantity > quantityAvailable) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [currentCategory.length, currentProduct.length, quantity, quantityAvailable]);

    return (
        <form className={inputStyles.text} autoComplete="off"
            onSubmit={onSubmit}>
            <FormControl variant="outlined" className={selectStyles.formControl}>
                <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currentCategory}
                    onChange={handleCategoryChange}
                >
                    {categories.map((category) =>
                        <MenuItem value={category.id}>{category.title}</MenuItem>
                    )}

                </Select>
            </FormControl>
            <FormControl variant="outlined" className={selectStyles.formControl}>
                <InputLabel id="demo-simple-select-label">Produto</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currentProduct}
                    onChange={handleProductChange}
                >
                    {products.map((product) =>
                        <MenuItem value={product.id}>{product.description}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <TextField
                disabled id="price"
                value={price}
                label="Preço"
                variant="outlined"
            />
            <TextField
                required type="number"
                id="quantity"
                label="Quantidade"
                variant="outlined"
                value={quantity}
                error={!quantityerror.quantity.valid}
                helperText={quantityerror.quantity.text}
                onChange={(event) => {
                    let q = event.target.value;
                    if (q <= 0 || q > quantityAvailable) {
                        setQuantityErrors(
                            {
                                quantity:
                                {
                                    valid: false,
                                    text: `A quantidade precisa ser maior que 0 e menor que ${quantityAvailable}`
                                }
                            });
                    } else {
                        setQuantityErrors({ quantity: { valid: true, text: "" } });
                    }
                    setQuantity(q);
                }}
            />

            <div className={inputStyles.button}>
                <Button disabled={disabled} type="submit" variant="contained" color="primary">Adicionar</Button>
            </div>
        </form>

    )
}