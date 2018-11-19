/**
 * Performs file parsing of members, communicates with
 * member API.
 */
import xlsx from "xlsx";
import axios from "axios";
import config from "../../config/config";

// allows us to return a predictable and consistent response for all errors.
const genericCatch = (error) => {
    const message = (error.response && error.response.data &&
        error.response.data.message) || "An unexpected error occurred, try again later.";
    return { error: message };
};

export default class MemberService {
    getMemberList() {
        return axios.get(`${config.databaseHost}/members`)
            .then((response) => {
                const list = response.data && response.data.data;
                return { members: list };
            })
            .catch(genericCatch);
    }

    getBlacklist() {
        return axios.get(`${config.databaseHost}/members/blacklist`)
            .then((response) => {
                const list = response.data && response.data.data;
                return { members: list };
            })
            .catch(genericCatch);
    }

    uploadMemberList(list) {
        return axios.post(`${config.databaseHost}/members`, {
            members: list
        })
            .then((response) => {
                const list = response.data && response.data.data;
                return { members: list };
            })
            .catch(genericCatch);
    }

    blacklistMember(member) {
        return axios.post(`${config.databaseHost}/members/blacklist`, member)
            .then((response) => {
                return { blacklistedMember: response.data };
            })
            .catch(genericCatch);
    }

    whitelistMember(email) {
        return axios.delete(`${config.databaseHost}/members/blacklist`, {
            params: { email }
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

    // Parses an array buffer to human readable data and then organizes it
    _bufferToData(buffer) {
        let workbook,
            emailTitle,
            binary = "";
        const bytes = new Uint8Array(buffer),
            warnings = [],
            members = [];

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

        // find the title of the email column
        emailTitle = Object.keys(workbook[0]).filter((key) => {
            return key.trim().toLowerCase().includes("email");
        });

        if (emailTitle.length > 1) {
            throw Error("There's more than one column that has 'email' in the title.");
        } else if (emailTitle.length === 0) {
            throw Error("There must be a column with the title 'email'.");
        }
        emailTitle = emailTitle[0];

        // collect each email into an array and track non-breaking issues
        workbook.forEach((row, index) => {
            if (!row[emailTitle].includes("@")) {
                // Add 2 to index because excel starts at 1, and 1 for the title row
                warnings.push(`row ${index + 2} has an invalid email: '${row[emailTitle]}'.`);
            } else {
                members.push({ email: row[emailTitle] });
            }
        });

        return {
            members,
            warnings
        };
    }

    parseMemberFile(file) {
        return this._parseFileToBuffer(file).then(this._bufferToData);
    }
}
