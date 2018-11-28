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

        this.getBlacklistAddCell = this.getBlacklistAddCell.bind(this);
    }

    wrapOnClick(clickFunction, data) {
        return () => clickFunction(data);
    }

    getBlacklistAddCell(cellContent, row) {
        const { addToBlacklist } = this.props;
        return (
            <div className="btn-action-cell">
                <button
                    className="btn btn-primary"
                    name={`add-blacklist-${row.email}`}
                    onClick={this.wrapOnClick(addToBlacklist, row)}
                >
                    <i className="fas fa-user-slash" />
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
            text: "Add to Blacklist",
            dataField: "isDummyField",
            isDummyField: true,
            formatter: this.getBlacklistAddCell,
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
    addToBlacklist: PropTypes.func.isRequired
};
