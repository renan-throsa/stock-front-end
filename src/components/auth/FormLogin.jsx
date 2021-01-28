import React, { useState } from 'react';
import Buttom from "@material-ui/core/Button";
import { TextField, Switch, FormControlLabel } from "@material-ui/core";

const validateEmail = (email) => {
    if (email.length < 5) {
        return { valid: false, text: "Email inválido." }
    }
    else {
        return { valid: true, text: "" }
    }
}

const validatePassword = (password) => {
    if (password.length < 5) {
        return { valid: false, text: "Senha inválida." }
    }
    else {
        return { valid: true, text: "" }
    }
}

export default function FormLogin(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const [emailerror, setEmailErrors] = useState({ valid: true, text: "" });
    const [passworderror, setPasswordErrors] = useState({ valid: true, text: "" });

    const onSubmit = (event) => {
        event.preventDefault();
        props.onSend({ email, password, remember });
    }

    return (
        <form onSubmit={onSubmit}>
            <TextField
                onChange={(event) => { setEmail(event.target.value) }}
                onBlur={(event) => { setEmailErrors(validateEmail(event.target.value)) }}
                required
                id="email-field"
                label="Email"
                value={email}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!emailerror.valid}
                helperText={emailerror.text}
            />

            <TextField
                onChange={(event) => { setPassword(event.target.value) }}
                onBlur={(event) => { setPasswordErrors(validatePassword(event.target.value)) }}
                required
                id="password-field"
                label="Senha"
                value={password}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!passworderror.valid}
                helperText={passworderror.text}
            />

            <FormControlLabel
                control={<Switch checked={remember} name="remember"
                    onChange={(event) => { setRemember(!remember) }} />}
                label="Lembrar de mim?"
            />
            <Buttom variant="contained" color="primary" type="submit">
                Entrar
            </Buttom>
        </form>)
}