/**
 * Wraps the Bootstrap table, defines columns, and generates
 * an action column allowing for editing/deleting gear.
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";
import Constants from "../../constants/constants";

export default class GearTable extends React.Component {
    constructor() {
        super();

        this.getActionCell = this.getActionCell.bind(this);
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
                    onClick={
                        this.getEditAction(this.props.onClickEdit, row)
                    }
                >
                    <i className="fas fa-pen" />
                </button>
                <button
                    className="btn btn-danger right-btn"
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
            text: "Actions",
            dataField: "isDummyField",
            isDummyField: true,
            formatter: this.getActionCell
        }];
    }

    render() {
        return (
            <Table
                keyField="code"
                columns={this.columns}
                data={this.props.gearList}
            />
        );
    }
}

GearTable.propTypes = {
    onClickEdit: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    gearList: PropTypes.array.isRequired
};
