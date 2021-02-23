import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from '../components/auth/Login';
import Client from '../components/client/Client';
import Product from '../components/product/Product'
import Category from '../components/category/Category'
import Supplier from '../components/supplier/Supplier'
import Report from '../components/report/Report'
import Sale from '../components/sale/Sale'
import Order from '../components/order/Order'
import Payment from "./payment/Payment";
import Payments from "./payment/Payments";
import NotFoundPage from "../components/error/NotFoundPage"

export default function Routes() {
    return (
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
    )

}