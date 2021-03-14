import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from '../auth/Login';
import Client from '../client/Client';
import Product from '../product/Product'
import Category from '../category/Category'
import Supplier from '../supplier/Supplier'
import Report from '../report/Report'
import Sale from '../sale/Sale'
import Order from '../order/Order'
import Payment from "../payment/Payment";
import Payments from "../payment/Payments";
import NotFoundPage from "../error/NotFoundPage"
import ErrorBoundary from '../../ErrorBoundary'

export default function Routes() {
    return (
        <ErrorBoundary>
            <Switch>
                <Route exact path='/' component={Report} />
                <Route path='/login' component={Login} />
                <Route path='/supplier' component={Supplier} />
                <Route path='/category' component={Category} />
                <Route path='/product' component={Product} />
                <Route path='/client' component={Client} />
                <Route path='/order' component={Order} />
                <Route path='/sale/client/:clientId' component={Sale} />
                <Route path='/payment/client/:clientId' component={Payment} />
                <Route path='/payment' component={Payments} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
        </ErrorBoundary>
    )

}