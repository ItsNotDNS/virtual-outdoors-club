/**
 * Wraps the Bootstrap table, defines columns
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

const { SearchBar } = Search;

export default class ReservationTable extends React.Component {
    constructor(props) {
        super(props);
        this.getComponents = this.getComponents.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
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
            formatter: (row, data) => <div>{data.gear.length}</div>
        }, {
            sort: true,
            dataField: "startDate",
            text: "Start Date"
        }, {
            sort: true,
            dataField: "endDate",
            text: "End Date"
        }, {
            sort: true,
            dataField: "status",
            text: "Status"
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
                        { dataField: "startDate", order: "desc" },
                        { dataField: "endDate", order: "desc" }
                    ]}
                />
            </div>
        );
    }

    render() {
        return (
            <ToolkitProvider
                search
                keyField="id"
                columns={this.columns}
                data={this.props.reservationList}
            >
                {this.getComponents}
            </ToolkitProvider>
        );
    }
}

ReservationTable.propTypes = {
    onSelectRow: PropTypes.func,
    reservationList: PropTypes.array.isRequired
};
