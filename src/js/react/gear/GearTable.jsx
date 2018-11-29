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
import { capitalizeFirstLetter } from "../utilities";

const { SearchBar } = Search;
export default class GearTable extends React.Component {
    constructor() {
        super();
        this.getActionCell = this.getActionCell.bind(this);
        this.getComponents = this.getComponents.bind(this);
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
            gearCategory: row.category,
            gearCondition: row.condition,
            gearStatus: row.statusDescription
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

    conditionFormatter(cell) {
        if (cell === "NEEDS_REPAIR") {
            return (
                <div className={`text-center gear-status-badge ${cell.toLowerCase()}`}>
                    {"Needs Repair"}
                </div>
            );
        }
        return (
            <div className={`text-center gear-status-badge ${cell.toLowerCase()}`}>
                {capitalizeFirstLetter(cell)}
            </div>
        );
    }

    categoryFormatter(cell) {
        return cell || "Category Deleted";
    }

    get columns() {
        return [{
            dataField: "code",
            text: "Gear ID",
            sort: true
        }, {
            dataField: "category",
            text: "Category",
            sort: true,
            formatter: this.categoryFormatter
        }, {
            dataField: "description",
            text: "Description",
            sort: true
        }, {
            dataField: "depositFee",
            text: "Deposit Fee",
            align: "right",
            sort: true
        }, {
            dataField: "condition",
            text: "Condition",
            sort: true,
            formatter: this.conditionFormatter,
            style: {
                verticalAlign: "middle"
            }
        }, {
            text: "Actions",
            dataField: "isDummyField",
            isDummyField: true,
            formatter: this.getActionCell,
            headerStyle: {
                width: "15%"
            }
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
                <SearchBar className="custom-search-field" {...props.searchProps} />
                <StatusSearchBar />
                <Table
                    {...props.baseProps}
                    defaultSorted={[
                        { dataField: "condition", order: "asc" },
                        { dataField: "code", order: "asc" }
                    ]}
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
    onSelectRow: PropTypes.func,
    gearList: PropTypes.array.isRequired,
    checkboxOptions: PropTypes.object.isRequired
};
