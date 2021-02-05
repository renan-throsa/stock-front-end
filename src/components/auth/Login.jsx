import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import FormLogin from './FormLogin'
import { Container, Typography } from "@material-ui/core";
import 'fontsource-roboto';
import Api from '../../services/Api'


export default function Login(props) {
    const [errorMessages, setErrorMessages] = useState([]);
    const [iserror, setIserror] = useState(false);

    const send = (data) => {
        let api = new Api('Account/Login');

        api.Login({ "Email": data.email, "Password": data.password })
            .then(result => {
                localStorage.setItem('token', result);
                setIserror(false);
                setErrorMessages([]);
                props.history.push('/')
            })
            .catch(error => {                               
                setErrorMessages([`Não foi possível fazer login. ${error}`]);
                setIserror(true);
            })
    }

    return (
        <div>
            {iserror &&
                <Alert
                    severity="error">
                    {errorMessages.map((msg, i) => {
                        return <div key={i}>{msg}</div>
                    })}
                </Alert>
            }
            <Container component="article" maxWidth="sm">
                <Typography variant="h3" align="center">Formulário de Login</Typography>
                <FormLogin onSend={send} />
            </Container>
        </div>
    )
}