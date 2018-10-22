/**
 * Wraps the Bootstrap table, defines columns, and generates
 * an action column allowing for editing/deleting gear categories.
 */

import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";
import Constants from "../../constants/constants";

export default class CategoryTable extends React.Component {
    constructor() {
        super();

        this.getActionCell = this.getActionCell.bind(this);
    }

    getEditAction(callback, name) {
        return () => callback(Constants.modals.EDITING, { category: { name } });
    }

    getActionCell(cellContent, row) {
        return (
            <div className="btn-action-cell">
                <button className="btn btn-primary left-btn" onClick={this.getEditAction(this.props.onClickEdit, row.name)}>
                    <i className="fas fa-pen" />
                </button>
                <button className="btn btn-danger right-btn">
                    <i className="fas fa-trash-alt" />
                </button>
            </div>
        );
    }

    get columns() {
        return [{
            dataField: "name",
            text: "Category Name"
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
                keyField="name"
                columns={this.columns}
                data={this.props.categories}
            />
        );
    }
}

CategoryTable.propTypes = {
    onClickEdit: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired
};
