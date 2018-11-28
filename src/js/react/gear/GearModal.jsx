/**
 * Allows a user to enter data to create/edit a piece of gear
 */

import React from "react";
import PropTypes from "prop-types";
import LabeledInput from "../components/LabeledInput";
import GearCategoryDropdown from "./GearCategoryDropdown";
import { Button, Modal, Tab, Table, Tabs } from "react-bootstrap";
import ErrorAlert from "../components/ErrorAlert";
import { capitalizeFirstLetter } from "../utilities";

export default class GearModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.getGearForm = this.getGearForm.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event.target.name, event.target.value);
    };

    getGearForm(tabKey) {
        return (
            <Tab eventKey={tabKey} title="Gear Form">
                <div className="row">
                    <div className="col-md-12">
                        <ErrorAlert
                            show={this.props.error || false}
                            errorMessage={this.props.errorMessage || ""}
                        />
                        <LabeledInput
                            label="Gear ID"
                            name="gearCode"
                            placeholder="BP01"
                            onChange={this.handleChange}
                            value={this.props.gearCode}
                        />
                        <LabeledInput
                            label="Deposit Fee"
                            name="depositFee"
                            placeholder="50.00"
                            onChange={this.handleChange}
                            value={this.props.depositFee}
                        />
                        <LabeledInput
                            label="Description"
                            name="gearDescription"
                            placeholder="Brand new"
                            onChange={this.handleChange}
                            value={this.props.gearDescription}
                        />
                        <GearCategoryDropdown
                            onChange={this.handleChange}
                            value={this.props.gearCategory}
                        />
                    </div>
                </div>
            </Tab>
        );
    }

    getGearHistory(tabKey) {
        return (
            <Tab eventKey={tabKey} title="Gear History">
                <div className="row">
                    <div className="col-md-12">
                        {this.buildGearHistoryTable()}
                    </div>
                </div>
            </Tab>
        );
    }

    buildGearHistoryTable() {
        if (Array.isArray(this.props.gearHistory) && !!this.props.gearHistory.length) {
            const rows = [];
            for (let i = 0; i < Math.min(this.props.gearHistory.length, 10); i++) {
                const record = this.props.gearHistory[i];
                rows.push(
                    <tr key={`gear-history-${i}`}>
                        <td>
                            {record.code}
                        </td>
                        <td>
                            {record.category}
                        </td>
                        <td>
                            {record.description}
                        </td>
                        <td>
                            {record.depositFee}
                        </td>
                        <td>
                            {capitalizeFirstLetter(record.condition)}
                        </td>
                        <td>
                            {record.statusDescription}
                        </td>
                    </tr>
                );
            }
            return (
                <div className="table-responsive">
                    <Table>
                        <thead>
                            <tr>
                                <th>Gear ID</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Fee</th>
                                <th>Condition</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                </div>
            );
        }
        return this.props.gearHistory;
    }

    getGearReservationHistory(tabKey) {
        return (
            <Tab eventKey={tabKey} title="Gear Reservation History">
                <div className="row">
                    <div className="col-md-12">
                        {this.buildGearReservationHistoryTable()}
                    </div>
                </div>
            </Tab>
        );
    }

    buildGearReservationHistoryTable() {
        if (Array.isArray(this.props.gearReservationHistory) && !!this.props.gearReservationHistory.length) {
            const rows = [];
            for (let i = 0; i < Math.min(this.props.gearReservationHistory.length, 10); i++) {
                const record = this.props.gearReservationHistory[i];
                rows.push(
                    <tr key={`gear-reservation-history-${i}`}>
                        <td>
                            {record.email}
                        </td>
                        <td>
                            {record.licenseName}
                        </td>
                        <td>
                            {record.licenseAddress}
                        </td>
                        <td>
                            {record.startDate}
                        </td>
                        <td>
                            {record.endDate}
                        </td>
                    </tr>
                );
            }
            return (
                <div className="table-responsive">
                    <Table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                </div>
            );
        }
        return this.props.gearReservationHistory;
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.props.formTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        id="gear-modal"
                        activeKey={this.props.tabSelected}
                        onSelect={this.props.onTabSelected}
                    >
                        {this.getGearForm(1)}
                        {this.getGearHistory(2)}
                        {this.getGearReservationHistory(3)}
                    </Tabs>
                </Modal.Body>
                {
                    this.props.tabSelected === 1
                        ? <Modal.Footer>
                            <Button
                                type="button"
                                onClick={this.props.onClose}
                            >
                        Close
                            </Button>
                            <Button
                                bsStyle="primary"
                                onClick={this.props.onSubmit}
                            >
                        Submit
                            </Button>
                        </Modal.Footer>
                        : null
                }

            </Modal>
        );
    }
}

GearModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onTabSelected: PropTypes.func.isRequired,

    tabSelected: PropTypes.number.isRequired,

    formTitle: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    gearCode: PropTypes.string,
    depositFee: PropTypes.string,
    gearDescription: PropTypes.string,
    gearCategory: PropTypes.string,
    gearHistory: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    gearReservationHistory: PropTypes.oneOfType([PropTypes.string, PropTypes.array])

};
