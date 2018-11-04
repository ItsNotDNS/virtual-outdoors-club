import React from "react";
import PropTypes from "prop-types";
import LabeledInput from "../../components/LabeledInput";
import { Button } from "react-bootstrap";
import ErrorAlert from "../../components/ErrorAlert";

export default class EmailValidationForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event.target.name, event.target.value);
    }

    render() {
        return (
            <div className="centre-half">
                <ErrorAlert
                    show={this.props.error}
                    errorMessage={this.props.errorMessage}
                />
                Please enter your email to view your reservation.
                <LabeledInput
                    label="Email"
                    name="email"
                    placeholder="JohnDoe@email.com"
                    onChange={this.handleChange}
                />
                <Button
                    bsStyle="primary"
                    onClick={this.props.onSubmit}
                >
                    Submit
                </Button>
            </div>
        );
    }
}

EmailValidationForm.propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,

    error: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired
};
