/**
 * Home page for reservation creation.
 */
import React from "react";
import Reflux from "reflux";
import { ReservationStore, ReservationActions } from "./ReservationStore";
import ReservationTable from "./ReservationTable";
import Constants from "../../constants/constants";
import ReservationForm from "./ReservationForm";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ErrorAlert from "../components/ErrorAlert";

export default class ReservationPage extends Reflux.Component {
    constructor() {
        super();
        this.store = ReservationStore;

        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!this.state.fetchedReservationList) {
            ReservationActions.fetchReservationList();
        }
    }

    wrapOpenModal(callback) {
        return () => callback(Constants.modals.CREATING);
    }

    render() {
        return (
            <div className="reservation-view">
                <ErrorAlert show={!!this.state.error} errorMessage={this.state.error} />
                <div className="row">
                    <div className="col-md-12">
                        <ReservationTable
                            reservationList={this.state.reservationList}
                            onClickEdit={ReservationActions.openReservationModal}
                            onClickDelete={ReservationActions.openCancelReservationModal}
                        />
                    </div>
                </div>
                <ReservationForm {...this.state.reservationModal}
                    formTitle={`${this.state.reservationModal.mode} Reservation`}
                    onClose={ReservationActions.closeReservationModal}
                    onSubmit={ReservationActions.submitReservationModal}
                    onApproveReservation={ReservationActions.approveReservation}
                />
                <ConfirmationDialog
                    show={this.state.cancelReservationModal.show}
                    title="Cancel Reservation"
                    message="Are you sure you want to cancel this reservation?"
                    onClose={ReservationActions.closeCancelReservationModal}
                    onSubmit={ReservationActions.submitCancelReservationModal}
                    error={this.state.cancelReservationModal.error}
                    errorMessage={this.state.cancelReservationModal.errorMessage}
                />
            </div>
        );
    }
};
