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
        this.state = {
            categoryOptions: {}
        };
        this.addButtonFormatter = this.addButtonFormatter.bind(this);
    }

    // columns for the gear table
    get columns() {
        return [{
            dataField: "code",
            text: "ID",
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
            dataField: "add",
            text: "Add",
            formatter: this.addButtonFormatter
        }];
    }

    getAddAction(callback, row) {
        return () => callback(row);
    }

    addButtonFormatter(cell, row) {
        return (
            <Button onClick={this.getAddAction(this.props.addToCart, row)}>
                +
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
                    hover
                    {...props.baseProps}
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
