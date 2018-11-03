/**
 * Wraps the Bootstrap table, defines columns, and generates
 * an action column allowing for editing/deleting gear.
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";
import Constants from "../../constants/constants";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import StatusSearchBar from "./StatusSearchBar";

const { SearchBar } = Search;
export default class GearTable extends React.Component {
    constructor() {
        super();
        this.getActionCell = this.getActionCell.bind(this);
        this.state = {
            filteredGearList: []
        };
    }

    getEditAction(callback, row) {
        const gear = {
            id: row.id,
            expectedVersion: row.version,
            gearCode: row.code,
            depositFee: row.depositFee,
            gearDescription: row.description,
            gearCategory: row.category
        };

        return () => callback(Constants.modals.EDITING, { gear });
    }

    getDeleteAction(callback, row) {
        return () => callback(row.id);
    }

    getActionCell(cellContent, row) {
        return (
            <div className="btn-action-cell">
                <button
                    className="btn btn-primary left-btn"
                    name={`edit-gear-${row.code}`}
                    onClick={
                        this.getEditAction(this.props.onClickEdit, row)
                    }
                >
                    <i className="fas fa-pen" />
                </button>
                <button
                    className="btn btn-danger right-btn"
                    name={`delete-gear-${row.code}`}
                    onClick={
                        this.getDeleteAction(this.props.onClickDelete, row)
                    }
                >
                    <i className="fas fa-trash-alt" />
                </button>
            </div>
        );
    }

    get columns() {
        return [{
            dataField: "code",
            text: "Gear Code"
        }, {
            dataField: "category",
            text: "Category"
        }, {
            dataField: "description",
            text: "Description"
        }, {
            dataField: "depositFee",
            text: "Fee"
        }, {
            dataField: "condition",
            text: "Condition"
        }, {
            dataField: "version",
            text: "Version"
        }, {
            text: "Actions",
            dataField: "isDummyField",
            isDummyField: true,
            formatter: this.getActionCell
        }];
    }

    static getDerivedStateFromProps(props) {
        return {
            filteredGearList:
                props.gearList.filter(
                    (gear) => {
                        return props.checkboxOptions[gear.condition];
                    }
                )
        };
    }

    getComponents(props) {
        return (
            <div>
                <div className="custom-search-field">
                    <SearchBar {...props.searchProps} />
                    <StatusSearchBar />
                </div>
                <Table
                    {...props.baseProps}
                />
            </div>
        );
    }

    render() {
        return (
            <ToolkitProvider
                keyField="code"
                data={this.state.filteredGearList}
                columns={this.columns}
                search
            >
                {this.getComponents}
            </ToolkitProvider>
        );
    }
}

GearTable.propTypes = {
    onClickEdit: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    gearList: PropTypes.array.isRequired,
    checkboxOptions: PropTypes.object.isRequired
};
