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

    _parseGearData({ gear }) {
        return Object.keys(gear).map((key) => {
            let sum = 0.0;

            for (let i = 0; i < gear[key].usage.length; i++) {
                sum = sum + gear[key].usage[i];
            }

            sum = sum / gear[key].usage.length;

            return {
                code: key,
                usage: Number(sum * 100).toFixed(2), // ??
                description: gear[key].description
            };
        });
    }

    _parseCategoryData({ category }) {
        return Object.keys(category).map((key) => {
            let sum = 0.0;
            for (let i = 0; i < category[key].length; i++) {
                sum = sum + category[key][i];
            }
            sum = sum / category[key].length;
            return {
                code: key,
                usage: Number(sum * 100).toFixed(2) // ??
            };
        });
    }

    fetchStatisticsFromTo(startDate, endDate) {
        return this.service.get(`${config.databaseHost}/statistics?from=${startDate}&to=${endDate}`)
            .then((response) => {
                const gear = this._parseGearData(response.data.data),
                    category = this._parseCategoryData(response.data.data);
                return { gear, category };
            }).catch(genericCatch);
    }
}
