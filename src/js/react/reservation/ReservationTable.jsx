/**
 * Wraps the Bootstrap table, defines columns
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";

export default class ReservationTable extends React.Component {
    get columns() {
        return [{
            dataField: "id",
            text: "Reservation ID"
        }, {
            dataField: "email",
            text: "Email"
        }, {
            dataField: "licenseName",
            text: "Name"
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
    reservationList: PropTypes.array.isRequired
};
