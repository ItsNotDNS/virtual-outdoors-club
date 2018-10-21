/**
 * Allows a user to enter data to create/edit a piece of gear
 */

import React from "react";
import PropTypes from "prop-types";
import ButtonModalForm from "../components/ButtonModalForm";
import LabeledInput from "../components/LabeledInput";
import GearCategoryDropdown from "../gearCategory/GearCategoryDropdown";

export default class GearForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event.target.name, event.target.value);
    };

    render() {
        return (
            <ButtonModalForm
                formTitle={this.props.formTitle}
                onSubmit={this.props.onSubmit}
                onClose={this.props.onClose}
                show={this.props.show}
                error={this.props.error}
                errorMessage={this.props.errorMessage}
            >
                <LabeledInput
                    label="Gear ID"
                    name="gearCode"
                    placeholder="BP01"
                    onChange={this.handleChange}
                    value={this.props.gearCode}
                />
                <LabeledInput
                    label="Deposit amount"
                    name="depositFee"
                    placeholder="50.00"
                    onChange={this.handleChange}
                    value={this.props.depositFee}
                />
                <LabeledInput
                    label="Description"
                    name="gearDescription"
                    placeholder="Brand new"
                    onChange={this.handleChange}
                    value={this.props.gearDescription}
                />
                <GearCategoryDropdown
                    onChange={this.handleChange}
                    value={this.props.gearCategory}
                />
            </ButtonModalForm>
        );
    }
}

GearForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,

    formTitle: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    gearCode: PropTypes.string,
    depositFee: PropTypes.string,
    gearDescription: PropTypes.string,
    gearCategory: PropTypes.string
};
