import React from 'react'
import FormLogin from './FormLogin'
import { Container, Typography } from "@material-ui/core";
import 'fontsource-roboto';

const baseURL = "https://estoqapi.herokuapp.com/api/v2.0/Account/Login";

const send = (data) => {
    console.log(data)

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(data.email + ':' + data.password));

    var requestOptions = {
        method: 'POST',
        headers: headers
    };

    fetch("https://localhost:5001/api/v2.0/Account/Login", requestOptions)
        .then(response => response.json())
        .then(result => localStorage.setItem('token', result))
        .catch(error => console.log('error', error));
}

export default function Login() {
    return (
        <Container component="article" maxWidth="sm">
            <Typography variant="h3" align="center">Formulário de Login</Typography>
            <FormLogin onSend={send} />
        </Container>
    )
}