import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>
                Desculpe, o recurso solicitado não pôde ser encontrado.
            </h1>
            <p style={{ textAlign: "center" }}>
                <Link to="/">Ir para o painel principal</Link>
            </p>
        </div>
    )

}