/**
 * Wraps the Bootstrap table, defines columns, and generates
 * an action column allowing for viewing members.
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

const { SearchBar } = Search;
export default class MemberTable extends React.Component {
    constructor() {
        super();

        this.getBlacklistRemoveCell = this.getBlacklistRemoveCell.bind(this);
    }

    wrapOnClick(clickFunction, data) {
        return () => clickFunction(data);
    }

    getBlacklistRemoveCell(cellContent, row) {
        const { removeFromBlacklist } = this.props;
        return (
            <div className="btn-action-cell">
                <button
                    className="btn btn-danger"
                    name={`add-blacklist-${row.email}`}
                    onClick={this.wrapOnClick(removeFromBlacklist, row)}
                >
                    <i className="fas fa-user-times" />
                </button>
            </div>
        );
    }

    get columns() {
        return [{
            dataField: "email",
            text: "Member Email",
            sort: true
        }, {
            text: "Remove from Blacklist",
            dataField: "isDummyField",
            isDummyField: true,
            formatter: this.getBlacklistRemoveCell,
            headerStyle: {
                width: "15%"
            }
        }];
    }

    getComponents(props) {
        return (
            <div>
                <div className="custom-search-field">
                    <SearchBar {...props.searchProps} />
                </div>
                <Table
                    {...props.baseProps}
                    defaultSorted={[{ dataField: "email", order: "asc" }]}
                />
            </div>
        );
    }

    render() {
        return (
            <ToolkitProvider
                search
                keyField="email"
                columns={this.columns}
                data={this.props.memberList}
            >
                {this.getComponents}
            </ToolkitProvider>
        );
    }
}

MemberTable.propTypes = {
    memberList: PropTypes.array.isRequired,
    removeFromBlacklist: PropTypes.func.isRequired
};
