/**
 * Entry-point for the react code in the app.
 * Allows us to map various URLs to page-components
 */

import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import GearPage from "./gear/GearPage";
import RentPage from "./gear/RentPage";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="page-margin">
                    <Route exact path="/" component={GearPage} />
                    <Route path="/gear" component={GearPage} />
                    <Route path="/rent" component={RentPage} />
                </div>
            </BrowserRouter>
        );
    }
}
