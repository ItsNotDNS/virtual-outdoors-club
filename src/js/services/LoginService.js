import config from "../../config/config";
import axiosAuth from "../constants/axiosConfig";

// allows us to return a predictable and consistent response for all errors.
const genericCatch = (error) => {
    const message = (error.response && error.response.data &&
        error.response.data.message) || "An unexpected error occurred, try again later.";
    return { error: message };
};

export default class LoginService {
    // check credentials with django to obtain a token to access API
    submitLogin(user, pass) {
        return axiosAuth.axiosSingleton.post(`${config.authHost}/token-auth/`, {
            username: user,
            password: pass
        })
            .then((response) => {
                return { access: response.data.access, refresh: response.data.refresh };
            })
            .catch(genericCatch);
    }

    // takes an existing token that is still valid and update it to restart the timer
    refreshToken(token) {
        return axiosAuth.axiosSingleton.post(`${config.authHost}/token-refresh/`, {
            refresh: token
        })
            .then((response) => {
                return { access: response.data.access };
            })
            .catch(genericCatch);
    }
}
