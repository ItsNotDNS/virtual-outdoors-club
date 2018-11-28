/**
 * Creates a dropdown menu to select a gear condition.
 * Attached to the redux state so it can be used anywhere.
 */

import React from "react";
import Reflux from "reflux";
import PropTypes from "prop-types";
import {
    ControlLabel,
    FormControl,
    FormGroup
} from "react-bootstrap";
import {
    GearActions,
    GearStore
} from "./GearStore";
import Constants from "../../constants/constants";

export default class GearConditionDropdown extends Reflux.Component {
    constructor() {
        super();

        this.store = GearStore;
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
        GearActions.updateConditionDropdown(event.target.value);
    }

    render() {
        if (this.props.value !== Constants.gearConditions.RENTABLE &&
        this.props.value !== Constants.gearConditions.FLAGGED &&
        this.props.value !== Constants.gearConditions.NEEDS_REPAIR) {
            return null;
        }
        return (
            <FormGroup controlId="formControlsSelect">
                <ControlLabel>Gear Condition</ControlLabel>
                <FormControl
                    name="gearCondition"
                    componentClass="select"
                    placeholder="select"
                    value={this.props.value || this.state.conditionSelected.value}
                    onChange={this.handleChange}
                >
                    <option key={0}>Select A Condition</option>
                    <option key={2} value={Constants.gearConditions.RENTABLE}>Rentable</option>
                    <option key={1} value={Constants.gearConditions.FLAGGED}>Flagged</option>
                    <option key={3} value={Constants.gearConditions.NEEDS_REPAIR}>Needs Repair</option>
                </FormControl>
            </FormGroup>
        );
    }
}

GearConditionDropdown.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
};
