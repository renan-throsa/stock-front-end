import React, { createContext, useState } from 'react';
import Dashboard from './components/dashboad/Dashboard';

export const context = createContext();

export function App() {

    const [authenticated, setAuthenticated] = useState(false);

    const handleLogin = (result) => { localStorage.setItem('token', result); setAuthenticated(true) };

    return (
        <context.Provider value={{ authenticated, handleLogin }}>
            <Dashboard />
        </context.Provider>

    );
};

