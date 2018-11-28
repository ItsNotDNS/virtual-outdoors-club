/**
 * Translates "actions" (method calls) into REST API
 * calls and returns the responses as a promise
 */

import axios from "axios";
import config from "../../config/config";

// allows us to return a predictable and consistent response for all errors.
const genericCatch = (error) => {
    const message = (error.response && error.response.data &&
        error.response.data.message) || "An unexpected error occurred, try again later.";
    return { error: message };
};

export default class StatisticService {
    constructor(options = {}) {
        this.service = (options && options.service) || axios;
    }

    fetchGearStatisticList() {
        return this.service.get(`${config.databaseHost}/statistics`)
            .then((response) => {
                const gearStatData = Object.keys(response.data.data.gear).map((key) => {
                    return {
                        code: key,
                        usage: Number(response.data.data.gear[key].usage[0] * 100).toFixed(2), // ??
                        description: response.data.data.gear[key].description
                    };
                });
                // response data is wrapped in response object by the gear list
                return { data: gearStatData };
            })
            .catch(genericCatch);
    }

    fetchCategoryStatisticList() {
        return this.service.get(`${config.databaseHost}/statistics`)
            .then((response) => {
                const categoryStatData = Object.keys(response.data.data.category).map((key) => {
                    return {
                        code: key,
                        usage: Number(response.data.data.category[key][0] * 100).toFixed(2) // ??
                    };
                });
                // response data is wrapped in response object by the gear list
                return { data: categoryStatData };
            })
            .catch(genericCatch);
    }
}
