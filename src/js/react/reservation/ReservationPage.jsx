/**
 * Home page for reservation creation.
 */
import React from "react";
import Reflux from "reflux";
import { ReservationStore, ReservationActions } from "./ReservationStore";
import ReservationTable from "./ReservationTable";
import ReservationModal from "./ReservationModal";
import Constants from "../../constants/constants";
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
                            onSelectRow={ReservationActions.openReservationModal}
                        />
                        <ReservationModal
                            {...this.state.reservationModal}
                            actions={ReservationActions}
                            onClose={ReservationActions.closeReservationModal}
                            onClickEdit={ReservationActions.openReservationModal}
                            onClickDelete={ReservationActions.openCancelReservationModal}
                        />
                    </div>
                </div>
            </div>
        );
    }
};
