import React, { createContext, useState } from 'react';

const context = createContext()

function AuthProvider({ children }) {
    const [authenticated, setAuthenticated] = useState(false)

    const handleLogin = (result) => { localStorage.setItem('token', result); setAuthenticated(true) }
    return (
        <context.Provider value={{ authenticated, handleLogin }}>
            {children}
        </context.Provider>
    )
}

export { context, AuthProvider }