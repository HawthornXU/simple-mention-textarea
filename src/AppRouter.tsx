import React from "react";
import { BrowserRouter, Route, Switch, } from "react-router-dom";

export const AppRouter = () => (
    <BrowserRouter basename={`/`}>
        <Switch>
            <Route path="/">
            </Route>
        </Switch>
    </BrowserRouter>
)
