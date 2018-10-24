import React from "react";
import PropTypes from "prop-types";
import ButtonModalForm from "./ButtonModalForm";

export default function ConfirmationDialog({ show, title, message, onClose, onSubmit }) {
    return (
        <ButtonModalForm
            show={show}
            formTitle={title}
            onSubmit={onSubmit}
            onClose={onClose}
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
    onSubmit: PropTypes.func.isRequired
};
