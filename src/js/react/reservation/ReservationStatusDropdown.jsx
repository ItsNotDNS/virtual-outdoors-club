/**
 * Creates a dropdown menu to display the status of a reservation
 * Attached to the redux state so it can be used anywhere.
 */

import React from "react";
import Reflux from "reflux";
import PropTypes from "prop-types";
import { ReservationStore, ReservationActions } from "./ReservationStore";
import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";

export default class ReservationStatusDropdown extends Reflux.Component {
    constructor() {
        super();
        this.store = ReservationStore;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!this.state.fetchedReservationList) {
            ReservationActions.fetchReservationList();
        }
    }

    handleChange(event) {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
        ReservationActions.updateDropdown(event.target.value);
    }

    get dropdownOptions() {
        return [<option key={0} value={"REQUESTED"}>{"REQUESTED"}</option>,
            <option key={1} value={"APPROVED"}>{"APPROVED"}</option>,
            <option key={2} value={"CANCELLED"}>{"CANCELLED"}</option>,
            <option key={3} value={"PAID"}>{"PAID"}</option>,
            <option key={4} value={"TAKEN"}>{"TAKEN"}</option>,
            <option key={5} value={"RETURNED"}>{"RETURNED"}</option>];
    }

    render() {
        return (
            <FormGroup controlId="formControlsSelect">
                <ControlLabel>Reservation Status</ControlLabel>
                <FormControl
                    name="reservationStatus"
                    componentClass="select"
                    placeholder="select"
                    value={this.props.value || this.state.statusDropdown.value}
                    onChange={this.handleChange}
                >
                    {this.dropdownOptions}
                </FormControl>
            </FormGroup>
        );
    }
}

ReservationStatusDropdown.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
};
