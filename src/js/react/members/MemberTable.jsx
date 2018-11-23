/**
 * Wraps the Bootstrap table, defines columns, and generates
 * an action column allowing for viewing members.
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";

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
                width: "20%"
            }
        }];
    }

    render() {
        return (
            <Table
                keyField="email"
                columns={this.columns}
                data={this.props.memberList}
                defaultSorted={[{ dataField: "email", order: "asc" }]}
            />
        );
    }
}

MemberTable.propTypes = {
    memberList: PropTypes.array.isRequired,
    addToBlacklist: PropTypes.func.isRequired
};
