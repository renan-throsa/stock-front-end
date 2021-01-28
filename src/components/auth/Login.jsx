import React from 'react'
import FormLogin from './FormLogin'
import { Container, Typography } from "@material-ui/core";
import 'fontsource-roboto';

const send = (data) => {
    console.log(data);
 }

export default function Login() {
    return (
        <Container component="article" maxWidth="sm">
            <Typography variant="h3" align="center">Formulário de Login</Typography>
            <FormLogin onSend={send} />
        </Container>
    )
}