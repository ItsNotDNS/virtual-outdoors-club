/* eslint-disable react/no-unused-prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Modal, Alert } from "react-bootstrap";
import DatePicker from "./DatePickerV2";
import constants from "../../constants/constants";
import moment from "moment";
import Select from "react-select";

const {
    REQUESTED,
    APPROVED,
    PAID,
    TAKEN,
    RETURNED,
    CANCELLED
} = constants.reservations.status;

export default class ReservationModal extends React.Component {
    constructor(props) {
        super(props);

        this.footerButton = this.footerButton.bind(this);
        this.clickTrash = this.clickTrash.bind(this);
        this.getData = this.getData.bind(this);
    }

    getData() {
        const { edit: { startDate, endDate, gear }, data } = this.props,
            dataValues = { ...data },
            editableStatuses = {
                [REQUESTED]: true,
                [APPROVED]: true,
                [PAID]: true
            };

        // set if the user can edit fields on the modal
        dataValues.editable = editableStatuses[data.status];

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
        return {
            [REQUESTED]: (
                <div className="row">
                    <div className="col-xs-4">
                        {this.getButton("Terminate", actions.cancelReservation, "danger")}
                    </div>
                    <div className="col-xs-4">
                        {this.getButton("Save", actions.saveReservationChanges, "primary", { disabled: !data.canSave })}
                    </div>
                    <div className="col-xs-4">
                        {this.getButton("Approve", actions.approveReservation, "success")}
                    </div>
                </div>
            ),
            [APPROVED]: (
                <div>
                    <div className="row bottom-margin">
                        <div className="col-xs-4">
                            {this.getButton("Terminate", actions.cancelReservation, "danger")}
                        </div>
                        <div className="col-xs-4">
                            {this.getButton("Cash Deposit", null, "warning")}
                        </div>
                        <div className="col-xs-4">
                            {this.getButton("Save", actions.saveReservationChanges, "primary", { disabled: !data.canSave })}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-4" />
                        <div className="col-xs-4">
                            {this.getButton("Open Payment Page", () => window.open(`/pay?id=${data.id}`), "warning")}
                        </div>
                    </div>
                </div>
            ),
            [PAID]: (
                <div>Paid</div>
            ),
            [TAKEN]: (
                <div>Taken</div>
            ),
            [RETURNED]: (
                <div>Returned</div>
            ),
            [CANCELLED]: (
                <div className="text-center gray-out"><i>You cannot perform any actions on a cancelled reservation.</i></div>
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

    getGearList({ gear = [], editable }) {
        return gear.map((item, i) => {
            const iconView = editable ? this.getDeleteGearIcon(i) : null;
            return (
                <div className={`row left-margin right-margin ${editable ? "" : "gray-out"}`}
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
                />
                <div className="text-center top-margin">
                    {`(${daysLong} days long)`}
                </div>
            </div>
        );
    }

    render() {
        const { alertMsg, alertType, actions } = this.props,
            data = this.getData();

        return (
            <Modal show={this.props.show} bsSize="large" onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">
                        <span className="pull-left">{data.status}</span>
                        <span className="left-margin pull-left">{`Reservation #${data.id}`}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        {this.footerButton(data, actions)[data.status]}
                    </div>
                </Modal.Footer>
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
        loadAvailableGear: PropTypes.func.isRequired,
        addGearToReservation: PropTypes.func.isRequired,
        saveReservationChanges: PropTypes.func.isRequired
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
    })
};
