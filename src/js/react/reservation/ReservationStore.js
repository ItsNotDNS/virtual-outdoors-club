/**
 * Manages the state for the Reservation, primarily.
 */

import Reflux from "reflux";
import ReservationService from "../../services/ReservationService";

function defaultState() {
    return {
        fetchedReservationList: false,
        error: false,
        reservationList: []
    };
}

// Create actions and export them for use
export const ReservationActions = Reflux.createActions([
    "fetchReservationList"
]);

export class ReservationStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = ReservationActions; // listen for actions
    }

    onFetchReservationList() {
        const service = new ReservationService();

        this.setState({
            fetchedReservationList: true
        });

        return service.fetchReservationList()
            .then(({ data, error }) => {
                if (data) {
                    this.setState({
                        reservationList: data
                    });
                } else {
                    this.setState({
                        error
                    });
                }
            });
    }
}
