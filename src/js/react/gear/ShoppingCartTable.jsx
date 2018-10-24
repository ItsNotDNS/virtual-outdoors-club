/**
 * Table that shows gears that are in the user's shopping cart
 */

import React from "react";
import Reflux from "reflux";
import BootstrapTable from "react-bootstrap-table-next";
import { GearStore } from "../gear/GearStore";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

export default class ShoppingCartList extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = GearStore;
        this.removeButtonFormatter = this.removeButtonFormatter.bind(this);
        this.getRemoveAction = this.getRemoveAction.bind(this);
    }

    get columns() {
        return [{
            dataField: "code",
            text: "ID",
            sort: true
        }, {
            dataField: "description",
            text: "Description",
            sort: true
        }, {
            dataField: "remove",
            text: "Remove",
            formatter: this.removeButtonFormatter
        }];
    }

    getRemoveAction(callback, row) {
        return () => callback(row);
    }

    removeButtonFormatter(cell, row) {
        return (
            <Button onClick={
                this.getRemoveAction(this.props.removeFromCart, row)
            }>
                X
            </Button>
        );
    }

    render() {
        return (
            <BootstrapTable
                striped
                hover
                keyField="id"
                data={this.props.shoppingList}
                columns={this.columns}
            />
        );
    }
};

ShoppingCartList.propTypes = {
    shoppingList: PropTypes.array,
    removeFromCart: PropTypes.func.isRequired
};
