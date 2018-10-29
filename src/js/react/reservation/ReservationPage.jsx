/**
 * Home page for reservation creation.
 */
import React from "react";
import Reflux from "reflux";
import { ReservationStore, ReservationActions } from "./ReservationStore";
import ReservationTable from "./ReservationTable";

export default class ReservationPage extends Reflux.Component {
    constructor() {
        super();

        this.store = ReservationStore;
    }

    componentDidMount() {
        if (!this.state.fetchedReservationList) {
            ReservationActions.fetchReservationList();
        }
    }

    render() {
        return (
            <div className="reservation-view">
                <div className="row">
                    <div className="col-md-12">
                        <ReservationTable reservationList={this.state.reservationList} />
                    </div>
                </div>
            </div>
        );
    }
};
