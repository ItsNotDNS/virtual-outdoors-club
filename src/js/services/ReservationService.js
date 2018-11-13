/**
 * Translates "actions" (method calls) into REST API
 * calls and returns the responses as a promise
 */

import axios from "axios";
import config from "../../config/config";

export default class ReservationService {
    constructor(options = {}) {
        this.service = (options && options.service) || axios;
    }

    fetchReservationList() {
        return this.service.get(`${config.databaseHost}/reservation`)
            .then((response) => {
                // response data is wrapped in response object by the gear list
                return { data: response.data.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }

    fetchReservation(reservationId, email) {
        return this.service.get(`${config.databaseHost}/reservation?id=${reservationId}&email=${email}`)
            .then((response) => {
                return { data: response.data.data[0] };
            }).catch((error) => {
                return { error: error.response.data.message };
            });
    }

    fetchPayPalForm(reservationId) {
        return this.service.post(`${config.databaseHost}/process`, {
            id: reservationId
        })
            .then((response) => {
                return { data: response.data };
            }).catch((error) => {
                return { error: error.response.data.message };
            });
    }

    approveReservation(id) {
        return this.service.post(`${config.databaseHost}/reservation/approve`, { id })
            .then((response) => {
                const reservation = response.data;
                return { reservation };
            })
            .catch((error) => {
                const message = (error.response && error.response.data &&
                    error.response.data.message) || "An unexpected error occurred, try again later.";
                return { error: message };
            });
    }

    cancelReservation(id) {
        return this.service.post(`${config.databaseHost}/reservation/cancel`, { id })
            .then((response) => {
                const reservation = response.data;
                return { reservation };
            })
            .catch((error) => {
                const message = (error.response && error.response.data &&
                    error.response.data.message) || "An unexpected error occurred, try again later.";
                return { error: message };
            });
    }

    fetchReservationListFromTo(startDate, endDate) {
        return this.service.get(
            `${config.databaseHost}/reservation?from=${startDate}&to=${endDate}`
        ).then((response) => {
            return { data: response.data.data };
        }).catch((error) => {
            return { error: error.response.data.message };
        });
    }
}
