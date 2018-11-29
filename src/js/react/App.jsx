/**
 * Entry-point for the react code in the app.
 * Allows us to map various URLs to page-components
 */

import React from "react";
import Reflux from "reflux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import GearPage from "./gear/GearPage";
import ReservationPage from "./reservation/ReservationPage";
import RentPage from "./gear/RentPage";
import MemberPage from "./members/MemberPage";
import PaymentPage from "./reservation/payment/PaymentPage";
import VariabilityPage from "./variability/EditVariabilityPage";
import { LoginStore } from "./login/LoginStore";
import withAuth from "./components/higherOrder/withAuth";
import AccountPage from "./accounts/AccountsPage";
import StatisticsPage from "./statistics/StatisticsPage";
import DisableSystemPage from "./reservation/DisableSystemPage";
import HelpPage from "./help/HelpPage";

export default class App extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = LoginStore;
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={withAuth(GearPage)} />
                    <Route path="/gear" component={withAuth(GearPage)} />
                    <Route path="/reservation" component={withAuth(ReservationPage)} />
                    <Route path="/rent" component={withAuth(RentPage)} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/members" component={withAuth(MemberPage)} />
                    <Route path="/accounts" component={withAuth(AccountPage)} />
                    <Route path="/pay" component={PaymentPage} />
                    <Route path="/variability" component={withAuth(VariabilityPage)} />
                    <Route path="/statistics" component={withAuth(StatisticsPage)} />
                    <Route path="/disable" component={withAuth(DisableSystemPage)} />
                    <Route path="/help" component={withAuth(HelpPage)} />
                    <Route path="/member-help" component={HelpPage} />
                </Switch>
            </BrowserRouter>
        );
    }
}
