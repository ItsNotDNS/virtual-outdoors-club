/**
 * Wraps the Bootstrap table, defines columns, and generates
 * an action column allowing for editing/deleting gear.
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";
import Constants from "../../constants/constants";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

const { SearchBar } = Search;
export default class FlaggedGearTable extends React.Component {
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
            <button
                className="btn btn-primary"
                name={`delete-gear-${row.code}`}
                onClick={
                    this.getDeleteAction(this.props.onClickDelete, row)
                }
            >
            Mark as resolved
            </button>
        );
    }

    get columns() {
        return [{
            dataField: "code",
            text: "Gear ID",
            sort: true
        }, {
            dataField: "description",
            text: "Description",
            sort: true
        }, {
            dataField: "statusDescription",
            text: "Status",
            sort: true
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
                        return gear.condition === "FLAGGED";
                    }
                )
        };
    }

    getComponents(props) {
        return (
            <div>
                <div className="custom-search-field">
                    <SearchBar {...props.searchProps} />
                </div>
                <Table
                    {...props.baseProps}
                    defaultSorted={[{ dataField: "code", order: "asc" }]}
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

FlaggedGearTable.propTypes = {
    onClick: PropTypes.func.isRequired,
    gearList: PropTypes.array.isRequired
};
