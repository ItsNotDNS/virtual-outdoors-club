/**
 * Translates "actions" (method calls) into REST API
 * calls and returns the responses as a promise
 */
import config from "../../config/config";
import axiosAuth from "../constants/axiosConfig";

// allows us to return a predictable and consistent response for all errors.
const genericCatch = (error) => {
    const message = (error.response && error.response.data &&
        error.response.data.message) || "An unexpected error occurred, try again later.";
    return { error: message };
};

export default class ReservationService {
    fetchReservationList() {
        return axiosAuth.axiosSingleton.get(`${config.databaseHost}/reservation`)
            .then((response) => {
                // response data is wrapped in response object by the gear list
                return { data: response.data.data };
            })
            .catch(genericCatch);
    }

    fetchReservation(reservationId, email) {
        return axiosAuth.axiosSingleton.get(`${config.databaseHost}/reservation?id=${reservationId}&email=${email}`)
            .then((response) => {
                return { data: response.data.data[0] };
            }).catch(genericCatch);
    }

    fetchPayPalForm(reservationId) {
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/process`, {
            id: reservationId
        })
            .then((response) => {
                return { data: response.data };
            }).catch(genericCatch);
    }

    approveReservation(id) {
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/reservation/approve`, { id })
            .then((response) => {
                const reservation = response.data;
                return { reservation };
            })
            .catch(genericCatch);
    }

    payReservationCash(id) {
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/reservation/checkout`, { id, cash: true })
            .then((response) => {
                const reservation = response.data;
                return { reservation };
            })
            .catch(genericCatch);
    }

    cancelReservation(id) {
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/reservation/cancel`, { id })
            .then((response) => {
                const reservation = response.data;
                return { reservation };
            })
            .catch(genericCatch);
    }

    updateReservation(id, expectedVersion, patch) {
        return axiosAuth.axiosSingleton.patch(`${config.databaseHost}/reservation`, { id, expectedVersion, patch })
            .then((response) => {
                const reservation = response.data;
                return { reservation };
            })
            .catch(genericCatch);
    }

    fetchReservationListFromTo(startDate, endDate) {
        return axiosAuth.axiosSingleton.get(
            `${config.databaseHost}/reservation?from=${startDate}&to=${endDate}`
        ).then((response) => {
            return { data: response.data.data };
        }).catch((error) => {
            return { error: error.response.data.message };
        });
    }

    fetchGearReservationHistory(gearId) {
        return axiosAuth.axiosSingleton.get(
            `${config.databaseHost}/reservation?gearId=${gearId}`
        ).then((response) => {
            return {
                data: response.data.data
            };
        }).catch((error) => {
            return {
                error: error.response.data.message
            };
        });
    }

    fetchReservationHistory(reservationId) {
        return axiosAuth.axiosSingleton.get(
            `${config.databaseHost}/reservation/history?id=${reservationId}`
        ).then((response) => {
            return {
                data: response.data.data
            };
        }).catch((error) => {
            return {
                error: error.response.data.message
            };
        });
    }

    checkOutReservation(id) {
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/reservation/checkout`, { id })
            .then((response) => {
                return { reservation: response.data };
            }).catch(genericCatch);
    }

    checkInGear(id, gear, charge) {
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/reservation/checkin`, { id, gear, charge })
            .then((response) => {
                return { reservation: response.data };
            }).catch(genericCatch);
    }

    fetchSystemStatus() {
        return axiosAuth.axiosSingleton.get(
            `${config.databaseHost}/system`
        ).then((response) => {
            return { data: response.data.data };
        }).catch((error) => {
            return { error: error.response.data.message };
        });
    }

    enableSystem() {
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/system/`, {
            disableSys: false
        })
            .then((response) => {
                return { data: response.data.data };
            }).catch((error) => {
                return { error: error.response.data.message };
            });
    }

    disableSystem(cancelReservations) {
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/system/`,
            {
                disableSys: true,
                cancelRes: cancelReservations
            })
            .then((response) => {
                return { data: response.data.data };
            }).catch((error) => {
                return { error: error.response.data.message };
            });
    }
}
