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
            .catch(genericCatch);
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
            startDate: reserveGearForm.startDate,
            endDate: reserveGearForm.endDate,
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

    // parses a workbook for a column title and returns the name of it
    _getTitle(name, workbook) {
        name = name.trim().toLowerCase();
        // This will return a list of titles that contain the specified name
        const columnTitle = Object.keys(workbook[0]).filter((key) => {
            return key.trim().toLowerCase().includes(name);
        });

        if (columnTitle.length > 1) {
            throw Error(`There's more than one column that has '${name}' in the title.`);
        } else if (columnTitle.length === 0) {
            throw Error(`There must be a column with the title '${name}'.`);
        }

        return columnTitle[0]; // returns the name of the column that matches
    }

    // Parses an array buffer to human readable data and then organizes it
    _bufferToData(buffer) {
        let workbook,
            codeTitle = "",
            categoryTitle = "",
            descriptionTitle = "",
            feeTitle = "",
            binary = "";
        const bytes = new Uint8Array(buffer),
            warnings = [],
            categories = {},
            gearList = [];

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

        codeTitle = this._getTitle("code", workbook);
        categoryTitle = this._getTitle("category", workbook);
        descriptionTitle = this._getTitle("description", workbook);
        feeTitle = this._getTitle("fee", workbook);

        workbook.forEach((row, index) => {
            const rowNumber = index + 2,
                gear = {
                    gearCode: row[codeTitle] && row[codeTitle].trim(),
                    depositFee: row[feeTitle],
                    gearDescription: row[descriptionTitle] && row[descriptionTitle].trim(),
                    gearCategory: row[categoryTitle] && row[categoryTitle].trim().toLowerCase()
                };

            if (!gear.gearCode || !gear.gearCategory || !gear.gearDescription || !gear.gearCategory) {
                warnings.push(`Row ${rowNumber} has missing data.`);
            } else {
                gearList.push(gear);
                categories[gear.gearCategory] = true;
            }
        });

        return {
            gear: gearList,
            categories: Object.keys(categories),
            warnings
        };
    }

    parseGearFile(file) {
        return this._parseFileToBuffer(file).then(this._bufferToData);
    }

    uploadGearFile(categories, gearList) {
        const categoryPromises = categories.map((name) => this.createCategory({ name })),
            gearPromises = gearList.map((gear) => this.createGear(gear));

        return Promise.all(categoryPromises).then((categoryData) => {
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
                category: gear.category
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
};
