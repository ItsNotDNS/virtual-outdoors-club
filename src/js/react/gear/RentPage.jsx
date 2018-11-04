/**
 * Renting page for gear rental. Contains the list of rentable gear,
 * shopping cart, submit button for submitting reservations
 */

import React from "react";
import Reflux from "reflux";
import { GearStore, GearActions } from "./GearStore";
import RentGearTable from "./RentGearTable";
import ShoppingCartTable from "./ShoppingCartTable";
import LabeledInput from "../components/LabeledInput";
import DatePicker from "react-datepicker";
import ErrorAlert from "../components/ErrorAlert";
import { Button, Tab, Tabs } from "react-bootstrap";
import ButtonModalForm from "../components/ButtonModalForm";

export default class RentPage extends Reflux.Component {
    constructor() {
        super();
        this.store = GearStore;

        this.state = {
            showShoppingCart: false,
            mobileMode: window.innerWidth <= 768
        };
        this.handleChange = this.handleChange.bind(this);
        this.getShoppingCart = this.getShoppingCart.bind(this);
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

    getShoppingCart() {
        if (this.state.shoppingList.length > 0) {
            return (
                <ShoppingCartTable
                    removeFromCart={GearActions.removeFromShoppingCart}
                    shoppingList={this.state.shoppingList}
                />
            );
        } else {
            return (
                <div>
                    Empty Shopping Cart
                </div>
            );
        }
    }

    render() {
        return (
            <div className="gear-view">
                <Button
                    className="btn btn-primary pull-right "
                    disabled={this.state.checkoutDisabled}
                    onClick={GearActions.openReserveGearForm}
                >
                    Checkout
                </Button>
                <ButtonModalForm
                    formTitle="Reservation Form"
                    onSubmit={GearActions.submitReserveGearForm}
                    onClose={GearActions.closeReserveGearForm}
                    show={this.state.reserveGearForm.show}
                    error={false}
                    errorMessage={"error"}
                >
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
                </ButtonModalForm>
                <Tabs defaultActiveKey={1} id="rent-view-tabs">
                    <Tab eventKey={1} title="Gear">
                        <RentGearTable
                            gearList={this.state.gearList}
                            addToCart={GearActions.addToShoppingCart}
                        />
                    </Tab>
                    <Tab eventKey={2} title={`Shopping Cart (${this.state.shoppingList.length})`} >
                        {this.getShoppingCart()}
                    </Tab>
                </Tabs>
            </div>
        );
    }
};
