/**
 * Wraps the Bootstrap table, defines columns
 */
import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";

export default class CategoryStatisticTable extends React.Component {
    get columns() {
        return [{
            sort: true,
            dataField: "code",
            text: "Gear ID"
        }, {
            sort: true,
            dataField: "usage",
            text: "% Rented Out",
            align: "right"
        }];
    }

    render() {
        return (
            <Table
                keyField="code"
                columns={this.columns}
                data={this.props.gearStatList}
                defaultSorted={[
                    { dataField: "usage", order: "desc" }
                ]}
            />
        );
    }
}

CategoryStatisticTable.propTypes = {
    gearStatList: PropTypes.array.isRequired
};
