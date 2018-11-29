/**
 * Translates "actions" (method calls) into REST API
 * calls and returns the responses as a promise
 */

import axios from "axios";
import xlsx from "xlsx";
import config from "../../config/config";
import moment from "moment";

// allows us to return a predictable and consistent response for all errors.
const genericCatch = (error) => {
    const message = (error.response && error.response.data &&
        error.response.data.message) || "An unexpected error occurred, try again later.";
    return { error: message };
};

export default class GearService {
    constructor(options = {}) {
        this.service = (options && options.service) || axios;

        this._bufferToData = this._bufferToData.bind(this);
    }

    fetchGearList() {
        return this.service.get(`${config.databaseHost}/gear`)
            .then((response) => {
                // response data is wrapped in response object by the gear list
                return { data: response.data.data };
            })
            .catch(genericCatch);
    }

    createGear({ gearCode, depositFee, gearDescription, gearCategory, gearCondition, gearStatus }) {
        return this.service.post(`${config.databaseHost}/gear`, {
            code: gearCode,
            depositFee,
            description: gearDescription,
            category: gearCategory,
            condition: gearCondition,
            statusDescription: gearStatus
        })
            .then((response) => {
                return { gear: response.data };
            })
            .catch(genericCatch);
    }

    updateGear({ id, expectedVersion, gearCode, depositFee, gearDescription, gearCategory, gearCondition, gearStatus }) {
        return this.service.patch(`${config.databaseHost}/gear`, {
            id,
            expectedVersion,
            patch: {
                code: gearCode,
                depositFee,
                description: gearDescription,
                category: gearCategory,
                condition: gearCondition,
                statusDescription: gearStatus
            }
        })
            .then((response) => {
                return { gear: response.data };
            })
            .catch(genericCatch);
    }

    deleteGear(gearId) {
        return this.service.delete(`${config.databaseHost}/gear`, { params: { id: gearId } })
            .then((response) => {
                return { deleteGear: response.data };
            })
            .catch(genericCatch);
    }

    // fetch all categories including what they represent
    fetchGearCategoryList() {
        return this.service.get(`${config.databaseHost}/gear/categories`)
            .then((response) => {
                return { data: response.data.data };
            })
            .catch(genericCatch);
    }

    createCategory({ name }) {
        return this.service.post(`${config.databaseHost}/gear/categories`, { name })
            .then((response) => {
                return { category: response.data };
            })
            .catch(genericCatch);
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
            .catch(genericCatch);
    }

    deleteCategory(name) {
        return this.service.delete(`${config.databaseHost}/gear/categories`, { params: { name: name } })
            .then((response) => {
                return { deleteCategory: response.data };
            })
            .catch(genericCatch);
    }

    submitReservation(reserveGearForm) {
        const data = {
            email: reserveGearForm.email,
            licenseName: reserveGearForm.licenseName,
            licenseAddress: reserveGearForm.licenseAddress,
            startDate: moment(reserveGearForm.startDate).format("YYYY-MM-DD"),
            endDate: moment(reserveGearForm.endDate).format("YYYY-MM-DD"),
            status: "REQUESTED",
            gear: reserveGearForm.items
        };
        return this.service.post(`${config.databaseHost}/reservation`, data)
            .then((response) => {
                return { data: response.data };
            })
            .catch(genericCatch);
    }

    // Parses a file to an array buffer
    _parseFileToBuffer(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (event) => {
                resolve(event.target.result);
            };
            try {
                fileReader.readAsArrayBuffer(file);
            } catch (e) {
                reject(Error("Failed to parse the file."));
            }
        });
    }

    // ensure the required keys are in the column object
    _columnsHaveRequiredData(columns = {}, required = []) {
        let flag = true;
        required.forEach((expectedKey) => {
            if (!columns[expectedKey]) {
                flag = false;
            }
        });
        return flag;
    }

    _addWarning(warnings, key, row, msg) {
        if (warnings[key]) {
            warnings[key] += `, ${row}`;
        } else {
            warnings[key] = `${msg} on rows: ${row}`;
        }
    }

    // Parses an array buffer to human readable data and then organizes it
    _bufferToData(buffer) {
        let workbook,
            binary = "";
        const bytes = new Uint8Array(buffer),
            warnings = {},
            categories = {},
            requiredColumns = ["code", "description", "category", "fee"],
            rowsMissingRequiredData = [];

        // parse the file's data
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        // Try to parse the workbook
        try {
            workbook = xlsx.read(binary, { type: "binary" });
        } catch (e) {
            throw Error("Couldn't parse the file.");
        }

        // Check that there is only one sheet in the file
        if (workbook.SheetNames.length > 1) {
            throw Error(`The uploaded file has ${workbook.SheetNames.length} sheets. The file must have only 1 sheet.`);
        }
        workbook = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        // normalize workbook keys/values
        workbook = workbook.map((row, rowIndex) => {
            rowIndex = rowIndex + 2;

            const normalizedRow = {};

            Object.keys(row).forEach((key) => {
                const newKey = key.split("_")[0].trim().toLowerCase();
                if (normalizedRow[newKey]) {
                    throw Error(`Detected duplicate columns with the name '${newKey}'. Ensure you don't have columns with similar names.`);
                }
                normalizedRow[newKey] = row[key];
            });

            if (!this._columnsHaveRequiredData(normalizedRow, requiredColumns)) {
                rowsMissingRequiredData.push(rowIndex);
            };

            // lowercase category
            if (normalizedRow["category"]) {
                normalizedRow["category"] = normalizedRow["category"].trim().toLowerCase();
                categories[normalizedRow["category"]] = true;
            }

            // set defaults for status and statusDescription
            if (!normalizedRow["condition"]) {
                normalizedRow["condition"] = "RENTABLE";
                this._addWarning(warnings, "statusMissing", rowIndex, "Missing a 'condition' (added a default of RENTABLE)");
            }
            if (!normalizedRow["condition desc"]) {
                normalizedRow["condition desc"] = "";
                this._addWarning(warnings, "noteMissing", rowIndex, "Missing a 'condition desc' (will remain blank)");
            }

            return normalizedRow;
        });

        if (rowsMissingRequiredData.length === workbook.length) {
            throw Error(`It looks like you are missing a required title for a column, ensure you have these column titles: '${requiredColumns.join("', '")}'.`);
        } else if (rowsMissingRequiredData.length) {
            throw Error(`These rows are missing required data (under the column '${requiredColumns.join("', '")}'): ${rowsMissingRequiredData.join(", ")}.`);
        }

        workbook = workbook.map((row) => {
            return {
                gearCode: row.code,
                depositFee: row.fee,
                gearDescription: row.description,
                gearCategory: row.category,
                gearCondition: row.condition,
                gearStatus: row["condition desc"]
            };
        });

        return {
            gear: workbook,
            categories: Object.keys(categories),
            warnings
        };
    }

    parseGearFile(file) {
        return this._parseFileToBuffer(file).then(this._bufferToData);
    }

    uploadGearFile(categories, gearList) {
        const categoryPromises = categories.map((name) => this.createCategory({ name }));

        return Promise.all(categoryPromises).then(() => {
            const gearPromises = gearList.map((gear) => this.createGear(gear));

            return Promise.all(gearPromises).then((gearData) => {
                const failed = [];

                gearList.forEach((gear, index) => {
                    if (gearData[index].error) {
                        failed.push(gear.gearCode);
                    }
                });

                return { failed };
            });
        });
    }

    createGearFile(gearList) {
        const workbook = xlsx.utils.book_new();
        gearList = gearList.map((gear) => {
            return {
                code: gear.code,
                description: gear.description,
                fee: gear.depositFee,
                category: gear.category,
                condition: gear.condition,
                "condition desc": gear.statusDescription
            };
        });
        xlsx.utils.book_append_sheet(workbook, xlsx.utils.json_to_sheet(gearList), "Gear Sheet");
        xlsx.writeFile(workbook, `${moment().format("YYYY-MM-DD")}-gear-data.xlsx`);
    }

    fetchGearListFromTo(startDate, endDate) {
        return this.service.get(
            `${config.databaseHost}/gear?from=${startDate}&to=${endDate}`
        ).then((response) => {
            return { data: response.data.data };
        }).catch(genericCatch);
    }

    fetchGearHistory(gearId) {
        return this.service.get(
            `${config.databaseHost}/gear/history?id=${gearId}`
        ).then((response) => {
            return { data: response.data.data };
        }).catch((error) => {
            return { error: error.response.data.message };
        });
    }
};
