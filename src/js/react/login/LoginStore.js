import Reflux from "reflux";
import LoginService from "../../services/LoginService";
import Cookies from "universal-cookie";
import update from "immutability-helper";
import { setAxiosWithAuth } from "../../constants/axiosConfig";

let cancelTimeout;

export const LoginActions = Reflux.createActions([
        "handleLogout",
        "handleSubmit",
        "updateFields",
        "refreshToken",
        "checkRefreshToken"
    ]),
    // how long the access token should last - cookie expiration - 30 minutes
    ACCESS_EXPIRE = 30 * 60 * 1000,
    // how long the refresh token should last - cookie expiration - 24 hours
    REFRESH_EXPIRE = 864 * 100000,
    // how often it should refresh the token - setTimeout - 29 minutes
    REFRESH_ACCESS = 29 * 60 * 1000,
    cookies = new Cookies();

export class LoginStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = LoginActions;
    }

    onUpdateFields(event) {
        const target = event.target,
            field = target.name,
            value = target.value;
        this.setState({ [field]: value });
    }

    componentDidMount() {
        if (!cookies.get("token") && cookies.get("refresh")) {
            this.onRefreshToken();
        }
    }

    // authenticate user - not done in store due to lack of global use - assign permission in store
    onHandleSubmit() {
        const { name, password } = this.state,
            service = new LoginService();
        return service.submitLogin(name, password)
            .then(({ access, refresh, error }) => {
                let newstate;
                // if error exists
                if (error) {
                    newstate = update(this.state, {
                        error: { $set: true },
                        errorMessage: { $set: error }
                    });
                    this.setState(newstate);
                } else {
                    // set cookies in the site - single page app so no need to globalize
                    cookies.set("token", access, { maxAge: ACCESS_EXPIRE });
                    cookies.set("refresh", refresh, { maxAge: REFRESH_EXPIRE });
                    setAxiosWithAuth();
                    newstate = update(this.state, {
                        error: { $set: false },
                        errorMessage: { $set: "" },
                        isAuthenticated: { $set: true }
                    });
                    // reset the token every 5 minutes due to expiration of access token
                    cancelTimeout = setTimeout(LoginActions.refreshToken, REFRESH_ACCESS);
                    this.setState(newstate);
                }
            });
    }

    // reset the state and remove the data stored in the cookies
    onHandleLogout() {
        removeCookies();
        this.setState(defaultState());
    }

    // when the access token expires, use the refresh token given to get a new token (every 5 minutes)
    onRefreshToken() {
        const service = new LoginService(),
            token = cookies.get("refresh");
        // failure to get refresh token - expired or never had
        return service.refreshToken(token)
            .then(({ access, error }) => {
                let newstate;
                // if error exists - or refresh token does not exist
                if (error) {
                    newstate = update(this.state, {
                        error: { $set: true },
                        errorMessage: { $set: error },
                        name: { $set: "" },
                        password: { $set: "" },
                        isAuthenticated: { $set: false }
                    });
                } else {
                    cookies.set("token", access, { maxAge: ACCESS_EXPIRE });
                    setAxiosWithAuth();
                    newstate = update(this.state, {
                        error: { $set: false },
                        errorMessage: { $set: "" },
                        isAuthenticated: { $set: true }
                    });
                    // reset the token every 5 minutes due to expiration of access token
                    cancelTimeout = setTimeout(LoginActions.refreshToken, REFRESH_ACCESS);
                }
                this.setState(newstate);
            });
    }
}

function removeCookies() {
    clearTimeout(cancelTimeout);
    cookies.remove("token");
    cookies.remove("refresh");
}

// log out user every single time they enter into the site again through a new window
function defaultState() {
    if (cookies.get("refresh") && cookies.get("token")) {
        setAxiosWithAuth();
        cancelTimeout = setTimeout(LoginActions.refreshToken, REFRESH_ACCESS);
        return {
            error: false,
            errorMessage: "",
            name: "",
            password: "",
            isAuthenticated: true
        };
    } else {
        return {
            error: false,
            errorMessage: "",
            name: "",
            password: "",
            isAuthenticated: false
        };
    }
};
