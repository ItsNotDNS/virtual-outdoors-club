import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HelloWorld from "./HelloWorld";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={HelloWorld} />
                    <Route path='/hello' component={HelloWorld} />
                </Switch>
            </BrowserRouter>
        );
    }
}
