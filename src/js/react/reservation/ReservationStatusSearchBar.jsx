/**
 * Checkboxes for reservation status filtering
 */
import React from "react";
import { Checkbox, FormGroup } from "react-bootstrap";
import Constants from "../../constants/constants";
import { capitalizeFirstLetter } from "../utilities";
import PropTypes from "prop-types";

export default class ReservationStatusSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.changeValue(event.target.name, event.target.checked);
    };

    render() {
        return (
            <div>
                <FormGroup>
                    <div className="status-search-bar-header"> Reservation Status filter: </div>
                    <Checkbox inline name={Constants.reservations.status["REQUESTED"]}
                        checked={this.props.options[Constants.reservations.status["REQUESTED"]]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["REQUESTED"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["APPROVED"]}
                        checked={this.props.options[Constants.reservations.status["APPROVED"]]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["APPROVED"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["PAID"]}
                        checked={this.props.options[Constants.reservations.status["PAID"]]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["PAID"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["TAKEN"]}
                        checked={this.props.options[Constants.reservations.status["TAKEN"]]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["TAKEN"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["RETURNED"]}
                        checked={this.props.options[Constants.reservations.status["RETURNED"]]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["RETURNED"])}
                    </Checkbox>
                    <Checkbox inline name={Constants.reservations.status["CANCELLED"]}
                        checked={this.props.options[Constants.reservations.status["CANCELLED"]]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(Constants.reservations.status["CANCELLED"])}
                    </Checkbox>
                </FormGroup>
            </div>
        );
    }
}

ReservationStatusSearchBar.propTypes = {
    options: PropTypes.object.isRequired,
    changeValue: PropTypes.func.isRequired
};
