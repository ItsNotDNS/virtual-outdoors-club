/**
 * Wraps the Bootstrap table, defines columns
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";
import Constants from "../../constants/constants";

export default class ReservationTable extends React.Component {
    constructor() {
        super();

        this.getActionCell = this.getActionCell.bind(this);
    }

    getEditAction(callback, row) {
        const reservation = {
            id: row.id,
            email: row.email,
            licenseName: row.licenseName,
            licenseAddress: row.licenseAddress,
            startDate: row.startDate,
            endDate: row.endDate,
            status: row.status
        };
        return () => callback(Constants.modals.EDITING, { reservation });
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
            sort: true,
            dataField: "id",
            text: "Reservation ID"
        }, {
            sort: true,
            dataField: "email",
            text: "Email"
        }, {
            sort: true,
            dataField: "licenseName",
            text: "Name"
        }, {
            sort: true,
            dataField: "status",
            text: "Status"
        }, {
            sort: true,
            dataField: "startDate",
            text: "Start Date"
        }, {
            sort: true,
            dataField: "endDate",
            text: "End Date"
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
                keyField="id"
                columns={this.columns}
                data={this.props.reservationList}
            />
        );
    }
}

ReservationTable.propTypes = {
    onClickEdit: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    reservationList: PropTypes.array.isRequired
};
