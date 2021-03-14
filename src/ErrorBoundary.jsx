import React,{} from 'react'
import { Link } from 'react-router-dom';
import { Fragment } from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        //logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Fragment>
                <h1 style={{ textAlign: "center" }}>
                    Desculpe, o recurso solicitado não pôde ser encontrado.
            </h1>
                <p style={{ textAlign: "center" }}>
                    <Link to="/">Ir para o painel principal</Link>
                </p>

            </Fragment>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;