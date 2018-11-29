/**
 * Creates a dropdown menu to select a gear category.
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

export default class GearCategoryDropdown extends Reflux.Component {
    constructor() {
        super();

        this.store = GearStore;

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!this.state.fetchedGearCategoryList) {
            GearActions.fetchGearCategoryList();
        }
    }

    handleChange(event) {
        if (this.props.onChange) {
            this.props.onChange(event);
        }

        GearActions.updateDropdown(event.target.value);
    }

    get dropdownOptions() {
        return this.state.categoryList.map((category, index) => {
            return <option key={index} value={category.name}>{category.name}</option>;
        });
    }

    render() {
        return (
            <FormGroup controlId="formControlsSelect">
                <ControlLabel>Gear Category</ControlLabel>
                <FormControl
                    disabled={this.props.isDisabled}
                    name="gearCategory"
                    componentClass="select"
                    placeholder="select"
                    value={this.props.value || this.state.categoryDropdown.value}
                    onChange={this.handleChange}
                >
                    <option key={0}>Select A Category</option>
                    {this.dropdownOptions}
                </FormControl>
            </FormGroup>
        );
    }
}

GearCategoryDropdown.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    isDisabled: PropTypes.bool
};
