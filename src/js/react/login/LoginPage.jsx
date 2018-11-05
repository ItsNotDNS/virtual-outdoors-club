import React from "react";
import Reflux from "reflux";
import LabeledInput from "../components/LabeledInput";
import { Button, PageHeader, Image } from "react-bootstrap";
import logo from "../../../../doc/assets/UAOC_logo.png";

export default class LoginPage extends Reflux.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event.target.name, event.target.value);
    };

    render() {
        return (
            <div className="login-view">
                <div className="img-container ">
                    <Image src={logo} alt={logo} responsive />
                </div>

                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3">
                        <PageHeader className="page-header-view">
                            University of Alberta <br />
                            <small> Outdoors Club </small>
                        </PageHeader>
                        <LabeledInput
                            label="Login"
                            name="loginField"
                            placeholder="Enter username"
                            onChange={this.handleChange}
                            value={this.props.inputLogin}
                            className="label-login-view"
                        />
                        <LabeledInput
                            label="Password"
                            name="passwordField"
                            placeholder="Enter password"
                            onChange={this.handleChange}
                            value={this.props.inputPassword}
                            className="label-login-view"
                        />
                        <Button className="btn-primary submit-button"> Submit </Button>
                    </div>
                </div>
            </div>
        );
    }
};
