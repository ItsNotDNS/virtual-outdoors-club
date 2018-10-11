import React from "react";
import PropTypes from "prop-types";
import {Form, Input, Label} from "semantic-ui-react";

export default function LabeledInput(label, name) {
    return (
        <Form.Field>
            <Label content={label} />
            <Input name={name} />
        </Form.Field>
    )
}

PropTypes.LabeledInput = {
    label : PropTypes.string.isRequired,
    name : PropTypes.string.isRequired
};