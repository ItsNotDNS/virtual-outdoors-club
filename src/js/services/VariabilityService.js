/**
 * Service for system variability
 */
import axiosAuth from "../constants/axiosConfig";
import config from "../../config/config";
import constants from "../constants/constants";

const { EXECUTIVE, MEMBER } = constants.variability;

export default class VariabilityService {
    fetchSystemVariables() {
        return axiosAuth.axiosSingleton.get(`${config.databaseHost}/system/variability`)
            .then((response) => {
                return { data: response.data.data };
            })
            .catch((error) => {
                const message = (error.response && error.response.data &&
                    error.response.data.message) || "An unexpected error occurred, try again later.";
                return { error: message };
            });
    }

    setMemberSystemVariables(settings) {
        const data = {
            member: {
                "maxLength": settings[MEMBER].maxReservationLength,
                "maxFuture": settings[MEMBER].maxDaysInFutureCanStart,
                "maxGearPerReservation": settings[MEMBER].maxItemsReserved,
                "maxReservations": settings[MEMBER].maxReservations
            }
        };
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/system/variability`, data)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                const message = (error.response && error.response.data &&
                    error.response.data.message) || "An unexpected error occurred, try again later.";
                return { error: message };
            });
    }

    setExecSystemVariables(settings) {
        const data = {
            executive: {
                "maxLength": settings[EXECUTIVE].maxReservationLength,
                "maxFuture": settings[EXECUTIVE].maxDaysInFutureCanStart,
                "maxGearPerReservation": settings[EXECUTIVE].maxItemsReserved,
                "maxReservations": settings[EXECUTIVE].maxReservations
            }
        };
        return axiosAuth.axiosSingleton.post(`${config.databaseHost}/system/variability`, data)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                const message = (error.response && error.response.data &&
                    error.response.data.message) || "An unexpected error occurred, try again later.";
                return { error: message };
            });
    }
}
