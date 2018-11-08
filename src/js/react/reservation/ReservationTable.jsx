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

    get columns() {
        return [{
            dataField: "licenseName",
            text: "Name"
        }, {
            sort: true,
            dataField: "email",
            text: "Email"
        }, {
            dataField: "gear[]",
            text: "Items",
            formatter: (row, data) => <div>{data.gear.length}</div>
        }, {
            dataField: "startDate",
            text: "Start Date"
        }, {
            dataField: "endDate",
            text: "End Date"
        }, {
            dataField: "status",
            text: "Status"
        }];
    }

    render() {
        return (
            <Table
                keyField="id"
                columns={this.columns}
                data={this.props.reservationList}
                hover
                selectRow={{
                    mode: "radio",
                    hideSelectColumn: true, // hides the radio button
                    clickToSelect: true,    // allows user to click row, not a button
                    // prevent errors if onSelectRow isn't defined
                    onSelect: (row) => this.props.onSelectRow && this.props.onSelectRow(row)
                }}
            />
        );
    }
}

ReservationTable.propTypes = {
    onSelectRow: PropTypes.func,
    reservationList: PropTypes.array.isRequired
};
