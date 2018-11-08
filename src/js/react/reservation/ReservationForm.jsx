import React from "react";
import PropTypes from "prop-types";
import ButtonModalForm from "../components/ButtonModalForm";
import LabeledInput from "../components/LabeledInput";
import DateRangePicker from "../components/DateRangePicker";
import ReservationStatusDropdown from "./ReservationStatusDropdown";
import { Button } from "react-bootstrap";
import { ReservationActions } from "./ReservationStore";

export default class ReservationForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event.target.name, event.target.value);
    };

    handleStartDateChange(date) {
        ReservationActions.reservationModalChanged("startDate", date);
    }

    handleEndDateChange(date) {
        ReservationActions.reservationModalChanged("endDate", date);
    }

    render() {
        return (
            <ButtonModalForm
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
                formTitle={this.props.formTitle}
                show={this.props.show}
            >

                <LabeledInput
                    label="Reservation ID"
                    name="reservationID"
                    onChange={this.handleChange}
                    value={this.props.id || ""}
                />
                <LabeledInput
                    label="Email Address"
                    name="email"
                    onChange={this.handleChange}
                    value={this.props.email}
                />
                <LabeledInput
                    label="Name"
                    name="fullName"
                    onChange={this.handleChange}
                    value={this.props.licenseName}
                />
                <LabeledInput
                    label="Address"
                    name="address"
                    onChange={this.handleChange}
                    value={this.props.licenseAddress}
                />
                <DateRangePicker
                    setStartDate={this.handleStartDateChange}
                    setEndDate={this.handleEndDateChange}
                    horizontal
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                />
                <ReservationStatusDropdown
                    onChange={this.handleChange}
                    value={this.props.status}
                />
                <Button
                    className="pull-right"
                    type="button"
                    bsStyle="success"
                    onClick={this.props.onApproveReservation}
                >
                    Approve Reservation
                </Button>
                <div className="clearfix" />
            </ButtonModalForm>
        );
    }
}

ReservationForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onApproveReservation: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    formTitle: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    licenseAddress: PropTypes.string,
    licenseName: PropTypes.string,
    email: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    id: PropTypes.number
};
