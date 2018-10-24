/**
 * Renting page for gear rental. Contains the list of rentable gear,
 * shopping cart, submit button for submitting reservations
 */

import React from "react";
import Reflux from "reflux";
import { GearStore, GearActions } from "./GearStore";
import { FormGroup } from "react-bootstrap";
import RentGearList from "./RentGearTable";
import ShoppingCartList from "./ShoppingCartTable";

export default class RentPage extends Reflux.Component {
    constructor() {
        super();

        this.store = GearStore;
    }

    componentDidMount() {
        if (!this.state.fetchedGearList) {
            GearActions.fetchGearList();
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <form>
                        <FormGroup bsSize="large">
                            Gear List
                        </FormGroup>
                        <RentGearList
                            gearList={this.state.gearList}
                            addToCart={GearActions.addToShoppingCart}
                        />
                    </form>
                </div>
                <div className="col-md-6 ">
                    <form>
                        <FormGroup bsSize="large">
                            Shopping Cart
                        </FormGroup>
                        <ShoppingCartList
                            removeFromCart={GearActions.removeFromShoppingCart}
                            shoppingList={this.store.state.shoppingList}
                        />
                    </form>
                </div>
            </div>
        );
    }
};
