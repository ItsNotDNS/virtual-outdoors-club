/**
 * Translates "actions" (method calls) into REST API
 * calls and returns the responses as a promise
 */

import axios from "axios";
import config from "../../config/config";

export default class GearService {
    constructor(options = {}) {
        this.service = (options && options.service) || axios;
    }

    fetchGearList() {
        return this.service.get(`${config.databaseHost}/gear`)
            .then((response) => {
                // response data is wrapped in response object by the gear list
                return { data: response.data.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }

    createGear({ gearCode, depositFee, gearDescription, gearCategory }) {
        return this.service.post(`${config.databaseHost}/gear`, {
            code: gearCode,
            depositFee,
            description: gearDescription,
            category: gearCategory
        })
            .then((response) => {
                return { gear: response.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }

    updateGear({ id, expectedVersion, gearCode, depositFee, gearDescription, gearCategory }) {
        return this.service.patch(`${config.databaseHost}/gear`, {
            id,
            expectedVersion,
            patch: {
                code: gearCode,
                depositFee,
                description: gearDescription,
                category: gearCategory
            }
        })
            .then((response) => {
                return { gear: response.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }

    // todo: rename the variable to "id"
    // todo: fix this to actually fetch from endpoint
    deleteGear({ gearId }) {
        return this.service.delete(`${config.databaseHost}/gear`, { id: gearId });
    }

    // fetch all categories including what they represent
    fetchGearCategoryList() {
        return this.service.get(`${config.databaseHost}/gear/categories`)
            .then((response) => {
                return response.data.data;
            })
            .catch(() => {
                // return error; should be handled somehow..
            });
    }
};
