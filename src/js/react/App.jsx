/**
 * Entry-point for the react code in the app.
 * Allows us to map various URLs to page-components
 */

import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import NavbarAdmin from "./components/NavbarAdmin";
import GearPage from "./gear/GearPage";
import ReservationPage from "./reservation/ReservationPage";
import RentPage from "./gear/RentPage";
import PropTypes from "prop-types";
import MemberPage from "./members/MemberPage";
import PaymentPage from "./reservation/payment/PaymentPage";
import VariabilityPage from "./variability/EditVariabilityPage";
import AccountPage from "./accounts/AccountsPage";
import StatisticsPage from "./statistics/StatisticsPage";
import DisableSystemPage from "./reservation/DisableSystemPage";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.AdminWrapper = this.AdminWrapper.bind(this);
    }

    AdminWrapper(page) {
        const Page = page,
            Wrapper = (props) => {
                return (
                    <div>
                        {props.location.pathname.includes("login") ? null : <NavbarAdmin />}
                        <div className="nav-page-wrapper">
                            <Page {...props} />
                        </div>
                    </div>
                );
            };
        Wrapper.propTypes = {
            location: PropTypes.shape({
                pathname: PropTypes.string.isRequired
            })
        };
        return Wrapper;
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={this.AdminWrapper(GearPage)} />
                    <Route path="/gear" component={this.AdminWrapper(GearPage)} />
                    <Route path="/reservation" component={this.AdminWrapper(ReservationPage)} />
                    <Route path="/rent" component={this.AdminWrapper(RentPage)} />
                    <Route path="/login" component={this.AdminWrapper(LoginPage)} />
                    <Route path="/members" component={this.AdminWrapper(MemberPage)} />
                    <Route path="/accounts" component={this.AdminWrapper(AccountPage)} />
                    <Route path="/pay" component={PaymentPage} />
                    <Route path="/variability" component={this.AdminWrapper(VariabilityPage)} />
                    <Route path="/statistics" component={this.AdminWrapper(StatisticsPage)} />
                    <Route path="/disable" component={this.AdminWrapper(DisableSystemPage)} />
                </div>
            </BrowserRouter>
        );
    }
}
