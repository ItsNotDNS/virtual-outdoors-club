/* eslint-disable react/no-unused-prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Modal, Alert, Tab, Tabs, Table } from "react-bootstrap";
import DatePicker from "./DatePickerV2";
import constants from "../../constants/constants";
import moment from "moment";
import Select from "react-select";
import ReturnProcessor from "./ReturnProcessor";
import { capitalizeFirstLetter } from "../utilities";

const {
    status: {
        REQUESTED,
        APPROVED,
        PAID,
        TAKEN,
        RETURNED,
        CANCELLED
    }, actions: {
        CANCEL,
        APPROVE,
        PAY_CASH,
        CHECK_OUT
    }
} = constants.reservations;

export default class ReservationModal extends React.Component {
    constructor(props) {
        super(props);

        this.footerButton = this.footerButton.bind(this);
        this.clickTrash = this.clickTrash.bind(this);
        this.getData = this.getData.bind(this);
        this.buildTable = this.buildTable.bind(this);
    }

    getData() {
        const { edit: { startDate, endDate, gear }, data, showConfirmation } = this.props,
            dataValues = { ...data },
            editableStatuses = {
                [REQUESTED]: true,
                [APPROVED]: true,
                [PAID]: true
            };

        // set if the user can edit fields on the modal
        // should have editable status and not be showing a confirmation dialogue
        dataValues.editable = editableStatuses[data.status] && !showConfirmation;

        // set if user can save edited fields (using save button)
        if (startDate || endDate || gear) {
            dataValues.canSave = true;
        }

        if (startDate) {
            dataValues.startDate = startDate;
        }
        if (endDate) {
            dataValues.endDate = endDate;
        }
        if (gear) {
            dataValues.gear = gear;
        }

        if (dataValues.gear) {
            dataValues.totalDeposit = dataValues.gear.reduce((total, item) => {
                return total + Number(item.depositFee);
            }, 0);
            dataValues.totalDeposit = dataValues.totalDeposit.toFixed(2);
        }

        return dataValues;
    }

    getButton(text, onClick, type, options = {}) {
        return (
            <button onClick={onClick}
                disabled={options.disabled}
                className={`full-width btn btn-${type}`}
            >
                {text}
            </button>
        );
    }

    footerButton(data, actions) {
        const openConfirmWrapper = (type) => {
            return () => actions.showConfirmation(type);
        };

        if (data.canSave) {
            return {
                [data.status]: (
                    <div className="row">
                        <div className="col-xs-6">
                            {this.getButton("Go Back", actions.undoReservationChanges, "primary")}
                        </div>
                        <div className="col-xs-6">
                            {this.getButton("Save Changes", actions.saveReservationChanges, "success")}
                        </div>
                    </div>
                )
            };
        }

        return {
            [REQUESTED]: (
                <div className="row">
                    <div className="col-xs-4">
                        {this.getButton("Cancel", openConfirmWrapper(CANCEL), "danger")}
                    </div>
                    <div className="col-xs-4">
                        {this.getButton("Save", actions.saveReservationChanges, "primary")}
                    </div>
                    <div className="col-xs-4">
                        {this.getButton("Approve", openConfirmWrapper(APPROVE), "success")}
                    </div>
                </div>
            ),
            [APPROVED]: (
                <div className="row">
                    <div className="col-xs-4">
                        {this.getButton("Cancel", openConfirmWrapper(CANCEL), "danger")}
                    </div>
                    <div className="col-xs-4">
                        {this.getButton("Take Cash Deposit", openConfirmWrapper(PAY_CASH), "warning")}
                    </div>
                    <div className="col-xs-4">
                        {this.getButton("Open Payment Page", () => window.open(`/pay?id=${data.id}`), "primary")}
                    </div>
                </div>
            ),
            [PAID]: (
                <div className="row">
                    <div className="col-xs-6">
                        {this.getButton("Cancel", openConfirmWrapper(CANCEL), "danger")}
                    </div>
                    <div className="col-xs-6">
                        {this.getButton("Check Out", openConfirmWrapper(CHECK_OUT), "primary")}
                    </div>
                </div>
            ),
            [TAKEN]: (
                <ReturnProcessor />
            ),
            [RETURNED]: (
                <div>Returned</div>
            ),
            [CANCELLED]: (
                <div className="text-center gray-out"><i>You cannot perform any actions on a cancelled reservation.</i></div>
            )
        };
    }

    footerConfirm(data, actions) {
        const backBtn = (
            <div className="col-xs-6">
                {this.getButton("Go Back", actions.hideConfirmation, "primary")}
            </div>
        );

        return {
            [CANCEL]: (
                <div>
                    <div className="row text-center">
                        <p><strong>This will terminate the reservation and cannot be undone!</strong></p>
                    </div>
                    <div className="row">
                        {backBtn}
                        <div className="col-xs-6">
                            {this.getButton("Proceed", actions.cancelReservation, "danger")}
                        </div>
                    </div>
                </div>
            ),
            [APPROVE]: (
                <div>
                    <div className="row text-center">
                        <p><strong>This will approve the reservation and send an email to the member allowing them to pay up to a day before the reservation starts.</strong></p>
                    </div>
                    <div className="row">
                        {backBtn}
                        <div className="col-xs-6">
                            {this.getButton("Proceed", actions.approveReservation, "success")}
                        </div>
                    </div>
                </div>
            ),
            [PAY_CASH]: (
                <div>
                    <div className="row text-center">
                        <p><strong>The member should give you a cash deposit of $<u>{data.totalDeposit}</u> before you proceed.</strong></p>
                        <p>We'll remind you to give it back when they return the gear.</p>
                    </div>
                    <div className="row">
                        {backBtn}
                        <div className="col-xs-6">
                            {this.getButton("Proceed", actions.payCash, "warning")}
                        </div>
                    </div>
                </div>
            ),
            [CHECK_OUT]: (
                <div>
                    <div className="row text-center">
                        <p><strong>Ensure you check the ID of the member you are renting gear out to.</strong></p>
                        <p>This member paid online via PayPal, you don't have to worry about any cash!</p>
                    </div>
                    <div className="row">
                        {backBtn}
                        <div className="col-xs-6">
                            {this.getButton("Proceed", actions.checkOutReservation, "success")}
                        </div>
                    </div>
                </div>
            )
        };
    }

    clickTrash(index) {
        return () => {
            this.props.actions.editReservation({
                gear: this.getData().gear.filter((gear, fIndex) => fIndex !== index)
            });
        };
    }

    getDeleteGearIcon(i) {
        return (
            <span onClick={this.clickTrash(i)}
                className="clickable"
            >
                <i className="fa fa-trash pull-right" />
            </span>
        );
    }

    getGearList({ gear = [], editable, status }) {
        return gear.map((item, i) => {
            const iconView = editable ? this.getDeleteGearIcon(i) : null;
            return (
                <div className={`row left-margin right-margin ${status !== CANCELLED ? "" : "gray-out"}`}
                    key={i}
                >
                    {item.code} - {item.description} {iconView}
                </div>
            );
        });
    }

    getNameValueField(name, value) {
        return (
            <div>
                <strong>{name}</strong>: <span className="pull-right">{value}</span>
            </div>
        );
    }

    getModalAlert(msg, type) {
        if (msg) {
            return (
                <Alert bsStyle={type || "info"} className="text-center">
                    <h4>{msg}</h4>
                </Alert>
            );
        }
    }

    getReservationPeriodInfo(data, actions) {
        const { endDate, startDate, editable } = data,
            daysLong = moment(endDate).diff(moment(startDate), "days") + 1;

        return (
            <div>
                <div className="text-center bottom-margin">
                    <h4>Reservation Period</h4>
                </div>
                <DatePicker disabled={!editable}
                    onDateRangeChange={actions.editReservation}
                    startDate={data.startDate}
                    endDate={data.endDate}
                    allowSelectBeforeToday={false}
                    allowSelectAfterToday
                />
                <div className="text-center top-margin">
                    {`(${daysLong} days long)`}
                </div>
            </div>
        );
    }

    getFooter(data, showConfirmation, actions) {
        return this.footerConfirm(data, actions)[showConfirmation] ||
            this.footerButton(data, actions)[data.status];
    }

    getReservationInfoTab(tabKey) {
        const { alertMsg, alertType, actions } = this.props,
            data = this.getData();
        return (
            <Tab eventKey={tabKey} title="Current Info">
                <div className="row top-margin">
                    <div className="col-md-12">
                        {this.getModalAlert(alertMsg, alertType)}
                        <div className="text-center bottom-margin">
                            <h4>Member's Info</h4>
                        </div>
                        <div className="row">
                            <div className="col-md-3 col-xs-0" />
                            <div className="col-md-6 col-xs-12">
                                {this.getNameValueField("Name", data.licenseName)}
                                {this.getNameValueField("Address", data.licenseAddress)}
                                {this.getNameValueField("Email", data.email)}
                            </div>
                        </div>
                        <hr />
                        {this.getReservationPeriodInfo(data, this.props.actions)}
                        <hr />
                        <div className="text-center bottom-margin">
                            <h4>Gear Reserved</h4>
                        </div>
                        <div className="row bottom-margin">
                            <div className="col-md-3 col-xs-0" />
                            <div className="col-md-6 col-xs-12">
                                {this.getGearList(data)}
                            </div>
                        </div>
                        <div className="row" hidden={!data.editable}>
                            <div className="col-md-3 col-xs-0" />
                            <div className="col-md-6 col-xs-12">
                                <Select
                                    {...this.props.gearSelect}
                                    value=""
                                    onMenuOpen={actions.loadAvailableGear}
                                    onChange={actions.addGearToReservation}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
        );
    }

    buildTable() {
        if (Array.isArray(this.props.history) && !!this.props.history.length) {
            const rows = [];
            for (let i = 0; i < Math.min(this.props.history.length, 10); i++) {
                const record = this.props.history[i];
                rows.push(
                    <tr key={i}>
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
                        <td>
                            {capitalizeFirstLetter(record.status)}
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
                                <th>License Name</th>
                                <th>License Address</th>
                                <th>Start Date</th>
                                <th>End Date</th>
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
        return this.props.history;
    }

    getReservationHistoryTab(tabKey) {
        return (
            <Tab eventKey={tabKey} title="Reservation History">
                <div className="row">
                    <div className="col-md-12">
                        {this.buildTable()}
                    </div>
                </div>
            </Tab>
        );
    }

    render() {
        const { actions, showConfirmation } = this.props,
            data = this.getData();
        let badgeStyleClass = "";
        badgeStyleClass = data.status && data.status.toLowerCase();
        return (
            <Modal show={this.props.show} bsSize="large" onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">
                        <div className="hidden-xs">
                            <div className="reservation-badge-modal-container">
                                <span className={`pull-left reservation-badge ${badgeStyleClass} `}>{capitalizeFirstLetter(data.status)}</span>
                            </div>
                            <span className="left-margin pull-left">{`Reservation #${data.id}`}</span>
                        </div>
                        <div className="visible-xs">
                            <div className="row">
                                <span className={`reservation-badge ${badgeStyleClass} `}>{capitalizeFirstLetter(data.status)}</span>
                            </div>
                            <div className="row">
                                <span className="text-center">{`Reservation #${data.id}`}</span>
                            </div>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        id="reservation-modal"
                        activeKey={this.props.tabSelected}
                        onSelect={this.props.onTabSelected}
                    >
                        {this.getReservationInfoTab(1)}
                        {this.getReservationHistoryTab(2)}
                    </Tabs>
                </Modal.Body>
                {
                    this.props.tabSelected === 1
                        ? <Modal.Footer>
                            {this.getFooter(data, showConfirmation, actions)}
                        </Modal.Footer>
                        : null
                }

            </Modal>
        );
    }
}

ReservationModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    actions: PropTypes.shape({
        approveReservation: PropTypes.func.isRequired,
        cancelReservation: PropTypes.func.isRequired,
        editReservation: PropTypes.func.isRequired,
        checkOutReservation: PropTypes.func.isRequired,
        payCash: PropTypes.func.isRequired,
        loadAvailableGear: PropTypes.func.isRequired,
        addGearToReservation: PropTypes.func.isRequired,
        saveReservationChanges: PropTypes.func.isRequired,
        undoReservationChanges: PropTypes.func.isRequired,
        showConfirmation: PropTypes.func.isRequired,
        hideConfirmation: PropTypes.func.isRequired
    }).isRequired,
    show: PropTypes.bool.isRequired,
    alertMsg: PropTypes.string,
    alertType: PropTypes.string,
    data: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
        licenseName: PropTypes.string,
        licenseAddress: PropTypes.string,
        status: PropTypes.string,
        startDate: PropTypes.instanceOf(Date),
        endDate: PropTypes.instanceOf(Date),
        gear: PropTypes.array
    }),
    edit: PropTypes.shape({
        startDate: PropTypes.instanceOf(Date),
        endDate: PropTypes.instanceOf(Date),
        gear: PropTypes.array
    }),
    gearSelect: PropTypes.shape({
        isLoading: PropTypes.bool,
        gear: PropTypes.array,
        options: PropTypes.array
    }),
    showConfirmation: PropTypes.string,
    history: PropTypes.array,
    tabSelected: PropTypes.number,
    onTabSelected: PropTypes.func
};
