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
                if (error && error.response) {
                    return { error: error.response.data.message };
                }
                return { error: "Looks like the server is down. Are you sure it's running?" }; // No response means server is down.
            });
    }

    createGear({ gearCode, depositFee, gearDescription, gearCategory }) {
        return this.service.post(`${config.databaseHost}/gear`, {
            code: gearCode,
            depositFee,
            description: gearDescription,
            category: gearCategory,
            condition: "RENTABLE"
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

    deleteGear(gearId) {
        return this.service.delete(`${config.databaseHost}/gear`, { params: { id: gearId } })
            .then((response) => {
                return { deleteGear: response.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }

    // fetch all categories including what they represent
    fetchGearCategoryList() {
        return this.service.get(`${config.databaseHost}/gear/categories`)
            .then((response) => {
                return { data: response.data.data };
            })
            .catch((error) => {
                if (error && error.response) {
                    return { error: error.response.data.message };
                }
                return { error: "Looks like the server is down. Are you sure it's running?" }; // No response means server is down.
            });
    }

    createCategory({ name }) {
        return this.service.post(`${config.databaseHost}/gear/categories`, { name })
            .then((response) => {
                return { category: response.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }

    updateCategory({ originalName, newName }) {
        return this.service.patch(`${config.databaseHost}/gear/categories`, {
            name: originalName,
            patch: {
                name: newName
            }
        })
            .then((response) => {
                return { category: response.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }

    deleteCategory(name) {
        return this.service.delete(`${config.databaseHost}/gear/categories`, { params: { name: name } })
            .then((response) => {
                return { deleteCategory: response.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }

    submitReservation(reserveGearForm) {
        const data = {
            email: reserveGearForm.email,
            licenseName: reserveGearForm.licenseName,
            licenseAddress: reserveGearForm.licenseAddress,
            startDate: reserveGearForm.startDate,
            endDate: reserveGearForm.endDate,
            status: "REQUESTED",
            gear: reserveGearForm.items
        };
        return this.service.post(`${config.databaseHost}/reservation`, data)
            .then((response) => {
                return { reservation: response.data };
            })
            .catch((error) => {
                return { error: error.response.data.message };
            });
    }
};
