/**
 * Wrapper for ButtonModalForm with a simple confirmation
 * message instead of form data
 */
import React from "react";
import PropTypes from "prop-types";
import ButtonModalForm from "./ButtonModalForm";

export default function ConfirmationDialog({ show, title, message, onClose, onSubmit, error, errorMessage }) {
    return (
        <ButtonModalForm
            show={show}
            formTitle={title}
            onSubmit={onSubmit}
            onClose={onClose}
            error={error}
            errorMessage={errorMessage}
        >
            {message}
        </ButtonModalForm>
    );
}

ConfirmationDialog.propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired
};
