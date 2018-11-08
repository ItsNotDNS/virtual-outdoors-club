/* eslint-disable react/no-unused-prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Modal, Alert } from "react-bootstrap";
import constants from "../../constants/constants";

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

    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    getData() {
        const { edit: { startDate, endDate, gear }, data } = this.props,
            value = this.clone(data);

        if (startDate) {
            value.startDate = startDate;
        }
        if (endDate) {
            value.endDate = endDate;
        }
        if (gear) {
            value.gear = gear;
        }

        return value;
    }

    getButton(text, onClick, type, options) {
        return (
            <button onClick={onClick}
                className={`full-width btn btn-${type}`}
            >
                {text}
            </button>
        );
    }

    footerButton() {
        const { actions } = this.props;

        return {
            [REQUESTED]: (
                <div className="row">
                    <div className="col-xs-4">
                        {this.getButton("Cancel", actions.cancelReservation, "danger")}
                    </div>
                    <div className="col-xs-4">
                        {this.getButton("Save", null, "primary", { disabled: true })}
                    </div>
                    <div className="col-xs-4">
                        {this.getButton("Approve", actions.approveReservation, "success")}
                    </div>
                </div>
            ),
            [APPROVED]: (
                <div className="row">
                    <div className="col-xs-6">
                        {this.getButton("Pay With Cash", null, "primary")}
                    </div>
                    <div className="col-xs-6">
                        {this.getButton("Cancel", actions.cancelReservation, "danger")}
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
                <div className="text-center">You cannot perform any actions on a cancelled reservation.</div>
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

    getGearList(list = [], status) {
        return list.map((gear, i) => {
            const isCancelled = status === CANCELLED,
                style = {
                    color: isCancelled ? "lightgray" : "black"
                },
                icon = isCancelled ? null : <i className="fa fa-trash pull-right" />;
            return (
                <div onClick={this.clickTrash(i)}
                    style={style}
                    key={i}
                >
                    {gear.code} - {gear.description} {icon}
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
                <Alert bsStyle={type || "info"}>
                    <h4>{msg}</h4>
                </Alert>
            );
        }
    }

    render() {
        const { alertMsg, alertType } = this.props,
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
                    <div className="row">
                        <div className="col-md-6">
                            {this.getNameValueField("Name", data.licenseName)}
                            {this.getNameValueField("Address", data.licenseAddress)}
                        </div>
                        <div className="col-md-6">
                            {this.getNameValueField("Start", data.startDate)}
                            {this.getNameValueField("End", data.endDate)}
                        </div>
                    </div>
                    <hr />
                    <div className="text-center bottom-margin">
                        <h4>Gear Reserved</h4>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-xs-0" />
                        <div className="col-md-6 col-xs-12">
                            {this.getGearList(data.gear, data.status)}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        {this.footerButton()[data.status]}
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
        editReservation: PropTypes.func.isRequired

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
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        gear: PropTypes.array
    }),
    edit: PropTypes.shape({
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        gear: PropTypes.array
    })
};
