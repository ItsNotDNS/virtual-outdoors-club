// Main controller for the user-facing side of the application
// based on the browser URL, will route a user to the approprate page

import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import GearPage from "./gear/GearPage";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/gear" component={GearPage} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
