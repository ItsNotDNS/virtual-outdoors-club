/**
 * Allows a user to enter data to create/edit a gear category
 */

import React from "react";
import PropTypes from "prop-types";
import ButtonModalForm from "../components/ButtonModalForm";
import LabeledInput from "../components/LabeledInput";

export default class CategoryForm extends React.Component {
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
                    label="Category Name"
                    name="category"
                    placeholder="backpack"
                    onChange={this.handleChange}
                    value={this.props.category}
                />
            </ButtonModalForm>
        );
    }
}

CategoryForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,

    formTitle: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    category: PropTypes.string // name the user is creating/editing
};
