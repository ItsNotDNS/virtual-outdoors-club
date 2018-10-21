/**
 * Wrapper for Bootstrap Alert that defaults to an error
 * message style.
 */

import React from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";

export default function ErrorAlert({ show, errorMessage }) {
    if (show) {
        return (
            <Alert bsStyle="danger">
                {errorMessage}
            </Alert>
        );
    }
    return null;
}

ErrorAlert.propTypes = {
    show: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired
};
