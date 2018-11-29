import React from "react";
import Reflux from "reflux";
import { LoginStore } from "../../login/LoginStore";
import LoginPage from "../../login/LoginPage";
import NavbarAdmin from "../NavbarAdmin";

export default function withAuth(Component) {
    return class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.props = props;
            this.store = LoginStore;
        }

        shouldComponentUpdate(nextState) {
            return nextState.isAuthenticated !== this.state.isAuthenticated;
        }

        render() {
            if (this.props.location.pathname.includes("rent") && !this.state.isAuthenticated) {
                return (
                    <Component {...this.props} />
                );
            }
            if (this.state.isAuthenticated) {
                return (
                    <div className="with-auth">
                        <NavbarAdmin />
                        <div className="nav-page-wrapper">
                            <Component {...this.props} />
                        </div>
                    </div>
                );
            } else {
                return (
                    <div>
                        <LoginPage {...this.props} />
                    </div>
                );
            }
        }
    };
}
