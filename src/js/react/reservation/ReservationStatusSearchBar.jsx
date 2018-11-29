/**
 * Checkboxes for reservation status filtering
 */
import React from "react";
import { Checkbox, FormGroup } from "react-bootstrap";
import { ReservationActions } from "./ReservationStore";
import Constants from "../../constants/constants";
import { capitalizeFirstLetter } from "../utilities";

export default class ReservationStatusSearchBar extends React.Component {
    handleChange(event) {
        ReservationActions.reservationStatusCheckBoxChange(event.target.name, event.target.checked);
    };

    render() {
        return (
            <div>
                <FormGroup>
                    <div className="status-search-bar-header"> Reservation Status filter: </div>
                    <Checkbox inline name={Constants.reservations.status["REQUESTED"]}
                        defaultChecked
                        onClick={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["REQUESTED"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["APPROVED"]}
                        defaultChecked
                        onClick={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["APPROVED"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["PAID"]}
                        defaultChecked
                        onClick={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["PAID"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["TAKEN"]}
                        defaultChecked
                        onClick={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["TAKEN"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["RETURNED"]}
                        onClick={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["RETURNED"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["CANCELLED"]}
                        onClick={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["CANCELLED"])}
                    </Checkbox>
                </FormGroup>
            </div>
        );
    }
}
