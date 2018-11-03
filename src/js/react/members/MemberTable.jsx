/**
 * Wraps the Bootstrap table, defines columns, and generates
 * an action column allowing for viewing members.
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";

export default class MemberTable extends React.Component {
    get columns() {
        return [{
            dataField: "email",
            text: "Member Email"
        }];
    }

    render() {
        return (
            <Table
                keyField="email"
                columns={this.columns}
                data={this.props.memberList}
            />
        );
    }
}

MemberTable.propTypes = {
    memberList: PropTypes.array.isRequired
};
