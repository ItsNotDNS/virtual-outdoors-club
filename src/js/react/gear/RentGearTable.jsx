/**
 * Table that shows gears that are available to rent
 */

import React from "react";
import Reflux from "reflux";
import BootstrapTable from "react-bootstrap-table-next";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

const { SearchBar } = Search;
export default class RentGearTable extends Reflux.Component {
    constructor(props) {
        super(props);
        this.getActionCell = this.getActionCell.bind(this);
    }

    // columns for the gear table
    get columns() {
        return [{
            dataField: "code",
            text: "Gear ID",
            sort: true
        }, {
            dataField: "category",
            text: "Category",
            sort: true
        },
        {
            dataField: "description",
            text: "Description",
            sort: true
        }, {
            dataField: "depositFee",
            text: "Deposit Fee",
            align: "right",
            sort: true
        },
        {
            dataField: "add",
            text: "Add",
            formatter: this.getActionCell,
            headerStyle: {
                width: "15%"
            }
        }];
    }

    getAction(callback, row) {
        return () => callback(row);
    }

    getActionCell(cell, row) {
        return (
            <Button
                className="btn btn-primary addToCartButton"
                onClick={this.getAction(this.props.addToCart, row)}>
                <i className="fas fa-plus" />
            </Button>
        );
    }

    getComponents(props) {
        return (
            <div>
                <div className="custom-search-field">
                    <SearchBar {...props.searchProps} />
                </div>
                <BootstrapTable
                    {...props.baseProps}
                    defaultSorted={[{ dataField: "code", order: "asc" }]}
                />
            </div>
        );
    }

    render() {
        return (
            <ToolkitProvider
                keyField="id"
                data={this.props.gearList}
                columns={this.columns}
                search
            >
                {this.getComponents}
            </ToolkitProvider>
        );
    }
};

RentGearTable.propTypes = {
    addToCart: PropTypes.func.isRequired,
    gearList: PropTypes.array.isRequired
};
