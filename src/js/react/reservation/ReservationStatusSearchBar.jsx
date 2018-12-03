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
        const { options } = this.props,
            {
                REQUESTED,
                APPROVED,
                PAID,
                TAKEN,
                RETURNED,
                CANCELLED } = Constants.reservations.status;
        return (
            <div>
                <FormGroup>
                    <div className="status-search-bar-header"> Reservation Status filter: </div>
                    <Checkbox inline name={REQUESTED}
                        checked={options[REQUESTED]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(REQUESTED)}
                    </Checkbox>
                    <Checkbox inline name={APPROVED}
                        checked={options[APPROVED]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(APPROVED)}
                    </Checkbox>
                    <Checkbox inline name={PAID}
                        checked={options[PAID]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(PAID)}
                    </Checkbox>
                    <Checkbox inline name={TAKEN}
                        checked={options[TAKEN]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(TAKEN)}
                    </Checkbox>
                    <Checkbox inline name={RETURNED}
                        checked={options[RETURNED]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(RETURNED)}
                    </Checkbox>
                    <Checkbox inline name={CANCELLED}
                        checked={options[CANCELLED]}
                        onChange={this.handleChange}
                    >
                        {capitalizeFirstLetter(CANCELLED)}
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
