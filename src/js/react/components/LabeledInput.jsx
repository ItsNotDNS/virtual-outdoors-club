/**
 * Wrapper for Labelled Form Group, to reduce
 * the number of imports needed every time an input is needed
 */

import React from "react";
import PropTypes from "prop-types";
import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";

export default function LabeledInput({ label, name, placeholder, onChange, value }) {
    return (
        <FormGroup>
            <ControlLabel>{label}</ControlLabel>
            <FormControl
                name={name}
                type="text"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
            />
        </FormGroup>
    );
}

LabeledInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.any
};
