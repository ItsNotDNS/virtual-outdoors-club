/**
 * Wraps the Bootstrap table, defines columns
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { capitalizeFirstLetter } from "../utilities";
import ReservationStatusSearchBar from "./ReservationStatusSearchBar";

const { SearchBar } = Search;

export default class ReservationTable extends React.Component {
    constructor(props) {
        super(props);
        this.getComponents = this.getComponents.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
        this.state = {
            filteredReservationList: []
        };
    }

    statusFormatter(cell) {
        return (
            <div className={`text-center reservation-badge ${cell.toLowerCase()}`}>
                {capitalizeFirstLetter(cell)}
            </div>
        );
    }

    get columns() {
        return [{
            sort: true,
            dataField: "licenseName",
            text: "Name"
        }, {
            sort: true,
            dataField: "email",
            text: "Email"
        }, {
            sort: true,
            dataField: "gear[]",
            text: "Items",
            align: "right",
            formatter: (row, data) => <div>{data.gear.length}</div>
        }, {
            sort: true,
            dataField: "startDate",
            text: "Start Date",
            align: "right"
        }, {
            sort: true,
            dataField: "endDate",
            text: "End Date",
            align: "right"
        }, {
            sort: true,
            dataField: "status",
            text: "Status",
            formatter: this.statusFormatter
        }];
    }

    onSelectRow(row) {
        this.props.onSelectRow && this.props.onSelectRow(row);
    }

    getComponents(props) {
        return (
            <div>
                <div className="custom-search-field">
                    <SearchBar {...props.searchProps} />
                </div>
                <ReservationStatusSearchBar
                    options={this.props.checkboxOptions}
                    changeValue={this.props.changeCheckBox}
                />
                <Table
                    {...props.baseProps}
                    hover
                    selectRow={{
                        mode: "radio",
                        hideSelectColumn: true, // hides the radio button
                        clickToSelect: true,    // allows user to click row, not a button
                        // prevent errors if onSelectRow isn't defined
                        onSelect: this.onSelectRow
                    }}
                    defaultSorted={[
                        { dataField: "status", order: "desc" },
                        { dataField: "startDate", order: "desc" },
                        { dataField: "endDate", order: "desc" }
                    ]}
                />
            </div>
        );
    }

    static getDerivedStateFromProps(props) {
        return {
            filteredReservationList:
                props.reservationList.filter(
                    (reservation) => {
                        return props.checkboxOptions[reservation.status];
                    }
                )
        };
    }

    render() {
        return (
            <ToolkitProvider
                search
                keyField="id"
                columns={this.columns}
                data={this.state.filteredReservationList}
            >
                {this.getComponents}
            </ToolkitProvider>
        );
    }
}

ReservationTable.propTypes = {
    onSelectRow: PropTypes.func,
    reservationList: PropTypes.array.isRequired,
    checkboxOptions: PropTypes.object.isRequired,
    changeCheckBox: PropTypes.func.isRequired
};
