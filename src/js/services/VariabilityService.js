/**
 * Service for system variability
 */
import axios from "axios";
import config from "../../config/config";
import constants from "../constants/constants";

const { EXECUTIVE, MEMBER } = constants.variability;
export default class VariabilityService {
    fetchSystemVariables() {
        return axios.get(`${config.databaseHost}/system/variability`)
            .then((response) => {
                return { data: response.data.data };
            })
            .catch((error) => {
                const message = (error.response && error.response.data &&
                    error.response.data.message) || "An unexpected error occurred, try again later.";
                return { error: message };
            });
    }

    setSystemVariables(settings) {
        const data = {
            executive: {
                "maxLength": settings[EXECUTIVE].maxReservationLength,
                "maxFuture": settings[EXECUTIVE].maxDaysInFutureCanStart,
                "maxRentals": settings[EXECUTIVE].maxItemsReserved
            },
            member: {
                "maxLength": settings[MEMBER].maxReservationLength,
                "maxFuture": settings[MEMBER].maxDaysInFutureCanStart,
                "maxRentals": settings[MEMBER].maxItemsReserved
            }
        };
        return axios.post(`${config.databaseHost}/system/variability`, data)
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
