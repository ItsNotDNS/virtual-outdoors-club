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
import ErrorAlert from "../components/ErrorAlert";
import { Button, Tab, Tabs } from "react-bootstrap";
import ButtonModalForm from "../components/ButtonModalForm";
import DateRangePicker from "../components/DateRangePicker";
import { ToastContainer } from "react-toastify";

export default class RentPage extends Reflux.Component {
    constructor() {
        super();
        this.store = GearStore;
        this.handleChange = this.handleChange.bind(this);
        this.getShoppingCart = this.getShoppingCart.bind(this);
    }

    componentDidMount() {
        if (!this.state.fetchedGearList) {
            GearActions.fetchGearList();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.dateFilter !== this.state.dateFilter &&
            this.state.dateFilter.startDate !== null &&
            this.state.dateFilter.endDate != null) {
            GearActions.fetchGearListFromTo(this.state.dateFilter.startDate,
                this.state.dateFilter.endDate);
        }
    }

    handleChange(event) {
        GearActions.reserveGearFormChanged(event.target.name, event.target.value);
    };

    handleStartDateChange(date) {
        GearActions.reserveGearFormChanged("startDate", date);
    }

    handleEndDateChange(date) {
        GearActions.reserveGearFormChanged("endDate", date);
    }

    handleFilterStartDateChange(date) {
        GearActions.dateFilterChanged("startDate", date);
    }

    handleFilterEndDateChange(date) {
        GearActions.dateFilterChanged("endDate", date);
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
                <h3>Empty Shopping Cart</h3>
            );
        }
    }

    render() {
        return (
            <div className="rent-view">
                <ToastContainer
                    className="reservation-success-toast"
                    position="top-center"
                    autoClose={4000}
                    hideProgressBar
                    closeOnClick
                    pauseOnVisibilityChange={false}
                    draggablePercent={80}
                    pauseOnHover={false}
                />
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
                        value={this.state.reserveGearForm.email}
                    />
                    <LabeledInput
                        label="Legal Name (as on a government issued ID)"
                        name="licenseName"
                        onChange={this.handleChange}
                        value={this.state.reserveGearForm.licenseName}
                    />
                    <LabeledInput
                        label="Home Address (as on a government issued ID)"
                        name="licenseAddress"
                        onChange={this.handleChange}
                        value={this.state.reserveGearForm.licenseAddress}
                    />
                    <DateRangePicker
                        setStartDate={this.handleStartDateChange}
                        setEndDate={this.handleEndDateChange}
                        horizontal={false}
                        startDate={this.state.dateFilter.startDate}
                        endDate={this.state.dateFilter.endDate}
                    />
                </ButtonModalForm>
                <Tabs defaultActiveKey={1} id="rent-view-tabs">
                    <Tab eventKey={1} title="Gear">
                        <DateRangePicker
                            setStartDate={this.handleFilterStartDateChange}
                            setEndDate={this.handleFilterEndDateChange}
                            horizontal
                        />
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
