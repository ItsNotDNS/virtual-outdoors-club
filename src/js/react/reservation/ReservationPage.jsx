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
import DateRangePicker from "../components/DateRangePicker";

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

    handleFilterStartDateChange(date) {
        ReservationActions.dateFilterChanged("startDate", date);
    }

    handleFilterEndDateChange(date) {
        ReservationActions.dateFilterChanged("endDate", date);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.dateFilter !== this.state.dateFilter &&
            this.state.dateFilter.startDate !== null &&
            this.state.dateFilter.endDate != null) {
            ReservationActions.fetchReservationListFromTo(this.state.dateFilter.startDate,
                this.state.dateFilter.endDate);
        }
    }

    render() {
        return (
            <div className="reservation-view">
                <ErrorAlert show={!!this.state.error} errorMessage={this.state.error} />
                <div className="row">
                    <div className="col-md-12">
                        <DateRangePicker
                            setStartDate={this.handleFilterStartDateChange}
                            setEndDate={this.handleFilterEndDateChange}
                            horizontal
                        />
                        <ReservationTable
                            reservationList={this.state.reservationList}
                            onSelectRow={ReservationActions.openReservationModal}
                        />
                        <ReservationModal
                            {...this.state.reservationModal}
                            actions={ReservationActions}
                            onClose={ReservationActions.closeReservationModal}
                            onTabSelected={ReservationActions.reservationModalTabSelected}
                        />
                    </div>
                </div>
            </div>
        );
    }
};
