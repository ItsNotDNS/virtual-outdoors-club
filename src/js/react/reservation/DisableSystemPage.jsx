/**
 * Page for editing user variability
 */
import React from "react";
import Reflux from "reflux";
import ConfirmationDialog from "../components/ConfirmationDialog";
import PropTypes from "prop-types";
import { ReservationStore, ReservationActions } from "./ReservationStore";
import { Button, Checkbox, Label } from "react-bootstrap";
import ButtonModalForm from "../components/ButtonModalForm";
import ErrorAlert from "../components/ErrorAlert";

export default class DisableSystemPage extends Reflux.Component {
    constructor() {
        super();

        this.store = ReservationStore;
        this.getCurrentSystemComponent = this.getCurrentSystemComponent.bind(this);
        this.getChangeSystemComponent = this.getChangeSystemComponent.bind(this);
    }

    componentDidMount() {
        ReservationActions.fetchSystemStatus();
    }

    handleCheckboxChange(event) {
        ReservationActions.cancelFutureReservationsChange();
    }

    getCurrentSystemComponent() {
        if (!this.state.disableSystem.disableRent) {
            return (
                <div >
                    <h3>
                        Rental System:
                        <Label
                            bsStyle="success"
                            className="system-status-label"
                        >
                            Online
                        </Label>
                    </h3>
                    <p>
                        Here you can disable the rental system with the option of cancelling all requested and future reservations.
                    </p>
                </div>
            );
        } else {
            return (
                <div >
                    <h3>
                        Rental System:
                        <Label
                            bsStyle="danger"
                            className="system-status-label"
                        >
                            Offline
                        </Label>
                    </h3>
                    <p>
                        Here you can enable the rental system.
                    </p>
                </div>
            );
        }
    }

    getChangeSystemComponent() {
        if (!this.state.disableSystem.disableRent) {
            return (
                <div>
                    <strong>Are you sure you want to disable the gear rental system?</strong>
                    <br />
                    <p> This will prevent any members from creating a gear reservation. </p>

                    <Checkbox
                        onClick={this.handleCheckboxChange}
                    >
                        Cancel future reservations
                    </Checkbox>
                    <p hidden={!this.state.disableSystem.cancelFutureReservations} className="text-danger">
                        <i className="fa fa-exclamation-triangle" />
                        This will cancel all requested and approved reservations and disallow future reservations.
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <strong>Are you sure you want to enable the gear rental system?</strong>
                    <br />
                    <p> This will allow members to create gear reservations again. </p>
                </div>
            );
        }
    }

    getButton() {
        let className = "btn-success",
            buttonText = "Enable Rental System";
        if (!this.state.disableSystem.disableRent) {
            className = "btn-danger";
            buttonText = "Disable Rental System";
        }
        return (
            <Button
                className={className}
                onClick={ReservationActions.openDisableSystemDialog}
            >
                {buttonText}
            </Button>
        );
    }

    getConfirmationDialog() {
        let submitFunction = ReservationActions.enableSystem,
            title = "Enable Rental System";
        if (!this.state.disableSystem.disableRent) {
            submitFunction = ReservationActions.disableSystem;
            title = "Disable Rental System";
        }
        return (
            <ButtonModalForm
                onSubmit={submitFunction}
                onClose={ReservationActions.closeDisableSystemDialog}
                formTitle={title}
                show={this.state.disableSystem.showDialog}
                error={this.state.disableSystem.error}
                errorMessage={this.state.disableSystem.errorMessage}
            >
                {this.getChangeSystemComponent()}
            </ButtonModalForm>
        );
    }
    render() {
        return (
            <div className="disable-system col-md-6">
                <ErrorAlert
                    show={this.state.disableSystem.fetchError}
                    errorMessage={this.state.disableSystem.fetchErrorMessage}
                />
                {this.getCurrentSystemComponent()}
                {this.getButton()}
                {this.getConfirmationDialog()}
            </div>
        );
    }
}

ConfirmationDialog.propTypes = {
    allowed: PropTypes.bool
};
