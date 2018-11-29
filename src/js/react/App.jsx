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
import PageNotFound from "./help/PageNotFound";

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
                    <Route exact path="/gear" component={withAuth(GearPage)} />
                    <Route exact path="/reservation" component={withAuth(ReservationPage)} />
                    <Route exact path="/rent" component={withAuth(RentPage)} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/members" component={withAuth(MemberPage)} />
                    <Route exact path="/accounts" component={withAuth(AccountPage)} />
                    <Route exact path="/pay" component={PaymentPage} />
                    <Route exact path="/variability" component={withAuth(VariabilityPage)} />
                    <Route exact path="/statistics" component={withAuth(StatisticsPage)} />
                    <Route exact path="/disable" component={withAuth(DisableSystemPage)} />
                    <Route exact path="/help" component={withAuth(HelpPage)} />
                    <Route exact path="/member-help" component={HelpPage} />
                    <Route path="*" component={PageNotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}
