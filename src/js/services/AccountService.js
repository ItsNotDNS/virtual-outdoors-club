import axiosAuth from "../constants/axiosConfig";
import config from "../../config/config";

// allows us to return a predictable and consistent response for all errors.
const genericCatch = (error) => {
    const message = (error.response && error.response.data &&
        error.response.data.message) || "An unexpected error occurred, try again later.";
    return { error: message };
};

export default class AccountService {
    // would need to use corresponding usernames to set the passwords for admin and executive
    changePassword(name, newPass, oldPass = "") {
        if (oldPass) {
            return axiosAuth.axiosSingleton.post(`${config.databaseHost}/system/accounts/`, {
                user: name,
                oldPassword: oldPass,
                password: newPass
            }).then((response) => {
                return response;
            }).catch(genericCatch);
        } else {
            return axiosAuth.axiosSingleton.post(`${config.databaseHost}/system/accounts/`, {
                user: name,
                password: newPass
            }).then((response) => {
                return response;
            }).catch(genericCatch);
        }
    }
}
