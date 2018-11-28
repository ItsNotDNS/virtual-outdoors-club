/**
 * Wrapper for Bootstrap Modal to hide some of the boilerplate
 * modal logic
 */

import React from "react";
import PropTypes from "prop-types";
import ErrorAlert from "./ErrorAlert";
import { Modal, Button } from "react-bootstrap";

export default class ButtonModalForm extends React.Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.formTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ErrorAlert
                        show={this.props.error || false}
                        errorMessage={this.props.errorMessage || ""}
                    />
                    {this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={this.props.onClose}
                    >
                        {this.props.closeButtonText || "Close"}
                    </Button>
                    <Button
                        bsStyle="primary"
                        onClick={this.props.onSubmit}
                    >
                        {this.props.submitButtonText || "Submit"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ButtonModalForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    formTitle: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    show: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    submitButtonText: PropTypes.string,
    closeButtonText: PropTypes.string
};
