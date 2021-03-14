import React, { createContext, useState } from 'react';

const context = createContext()

function AuthProvider(props) {
    const [authenticated, setAuthenticated] = useState(false)

    const handleLogin = (result) => { localStorage.setItem('token', result); setAuthenticated(true) }

    return (
        <context.Provider value={{ authenticated, handleLogin }}>
            {props.children}
        </context.Provider>
    )
}

export { context, AuthProvider }