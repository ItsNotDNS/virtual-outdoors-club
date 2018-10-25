/**
 * Renting page for gear rental. Contains the list of rentable gear,
 * shopping cart, submit button for submitting reservations
 */

import React, { Fragment } from "react";
import Reflux from "reflux";
import { GearStore, GearActions } from "./GearStore";
import RentGearList from "./RentGearTable";
import ShoppingCartList from "./ShoppingCartTable";
import LabeledInput from "../components/LabeledInput";
import DatePicker from "react-datepicker";
import ErrorAlert from "../components/ErrorAlert";

export default class RentPage extends Reflux.Component {
    constructor() {
        super();
        this.store = GearStore;

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!this.state.fetchedGearList) {
            GearActions.fetchGearList();
        }
    }

    handleChange(event) {
        GearActions.reserveGearFormChanged(event.target.name, event.target.value);
    };

    handleStartDateChange(date) {
        GearActions.reserveGearFormChanged("startDate", date.format("YYYY-MM-DD"));
    }

    handleEndDateChange(date) {
        GearActions.reserveGearFormChanged("endDate", date.format("YYYY-MM-DD"));
    }

    getComponent() {
        if (this.state.reserveGearForm.show) {
            return (
                <Fragment>
                    Member Information
                    <ErrorAlert
                        show={this.state.reserveGearForm.error}
                        errorMessage={this.state.reserveGearForm.errorMessage}
                    />
                    <LabeledInput
                        label="Email"
                        name="email"
                        onChange={this.handleChange}
                    />
                    <LabeledInput
                        label="Legal Name (as on a government issued ID)"
                        name="licenseName"
                        onChange={this.handleChange}
                    />
                    <LabeledInput
                        label="Home Address (as on a government issued ID)"
                        name="licenseAddress"
                        onChange={this.handleChange}
                    />
                    Start date
                    <DatePicker
                        value={this.state.reserveGearForm.startDate}
                        onChange={this.handleStartDateChange}
                        dropdownMode="select"
                    />
                    End date
                    <DatePicker
                        value={this.state.reserveGearForm.endDate}
                        onChange={this.handleEndDateChange}
                        dropdownMode="select"
                    />
                    <button
                        className="btn"
                        onClick={GearActions.closeReserveGearForm}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={GearActions.submitReserveGearForm}
                    >
                        Reserve
                    </button>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    Gear List
                    <RentGearList
                        gearList={this.state.gearList}
                        addToCart={GearActions.addToShoppingCart}
                    />
                </Fragment>
            );
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    {this.getComponent()}
                </div>
                <div className="col-md-6 ">
                    <button
                        className="btn btn-primary"
                        disabled={this.state.checkoutDisabled}
                        onClick={GearActions.openReserveGearForm}
                    >
                        Checkout
                    </button>
                    Shopping Cart
                    <ShoppingCartList
                        removeFromCart={GearActions.removeFromShoppingCart}
                        shoppingList={this.state.shoppingList}
                    />
                </div>
            </div>
        );
    }
};
