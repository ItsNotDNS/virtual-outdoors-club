/**
 * Table that shows gears that are in the user's shopping cart
 */

import React from "react";
import Reflux from "reflux";
import BootstrapTable from "react-bootstrap-table-next";
import { GearStore } from "../gear/GearStore";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

export default class ShoppingCartTable extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = GearStore;
        this.removeButtonFormatter = this.removeButtonFormatter.bind(this);
        this.getRemoveAction = this.getRemoveAction.bind(this);
    }

    get columns() {
        return [{
            dataField: "code",
            text: "Gear ID",
            sort: true
        }, {
            dataField: "category",
            text: "Category",
            sort: true
        }, {
            dataField: "description",
            text: "Description",
            sort: true
        }, {
            dataField: "depositFee",
            text: "Deposit Fee",
            sort: true
        },
        {
            dataField: "remove",
            text: "Remove",
            formatter: this.removeButtonFormatter,
            headerStyle: {
                width: "15%"
            }
        }];
    }

    getRemoveAction(callback, row) {
        return () => callback(row);
    }

    removeButtonFormatter(cell, row) {
        return (
            <Button
                className="btn btn-danger removeFromCartButton full-width"
                onClick={
                    this.getRemoveAction(this.props.removeFromCart, row)
                }
            >
                <i className="far fa-trash-alt" />
            </Button>
        );
    }

    render() {
        return (
            <BootstrapTable
                keyField="id"
                data={this.props.shoppingList}
                columns={this.columns}
                defaultSorted={[{ dataField: "code", order: "asc" }]}
            />
        );
    }
};

ShoppingCartTable.propTypes = {
    shoppingList: PropTypes.array,
    removeFromCart: PropTypes.func.isRequired
};
