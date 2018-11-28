/**
 * Wraps the Bootstrap table, defines columns
 */
import React from "react";
import Table from "react-bootstrap-table-next";
import PropTypes from "prop-types";

export default class GearStatisticTable extends React.Component {
    get columns() {
        return [{
            sort: true,
            dataField: "code",
            text: "Gear ID"
        }, {
            dataField: "description",
            text: "Description"
        }, {
            sort: true,
            dataField: "usage",
            text: "% Rented Out"
        }];
    }

    render() {
        // console.log(this.props.gearStatList);
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

GearStatisticTable.propTypes = {
    gearStatList: PropTypes.array.isRequired
};
