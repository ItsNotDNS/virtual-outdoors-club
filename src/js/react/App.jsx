// Main controller for the user-facing side of the application
// based on the browser URL, will route a user to the approprate page

import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HelloWorld from "./HelloWorld";
import GearPage from "./gear/GearPage";
import AddGearForm from "./gear/forms/AddGearForm";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={HelloWorld} />
                    <Route path="/gear" component={GearPage} />
                    <Route path="/add-gear" component={AddGearForm} />
                </Switch>
            </BrowserRouter>
        );
    }
}
