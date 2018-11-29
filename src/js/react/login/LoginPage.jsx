import React from "react";
import Reflux from "reflux";
import LabeledInput from "../components/LabeledInput";
import { Button, PageHeader, Image, Form } from "react-bootstrap";
import { LoginStore, LoginActions } from "./LoginStore";
import ErrorAlert from "../components/ErrorAlert";
import logo from "../../../images/UAOC_logo.png";

export default class LoginPage extends Reflux.Component {
    constructor() {
        super();
        this.store = LoginStore;
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        LoginActions.updateFields(event);
    }

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
                        <Form>
                            <ErrorAlert
                                show={this.state.error || false}
                                errorMessage={this.state.errorMessage || ""}
                            />
                            <LabeledInput
                                label="Login"
                                name="name"
                                placeholder="Enter username"
                                onChange={this.handleChange}
                                className="label-login-view"
                                value={this.state.name}
                            />
                            <LabeledInput
                                label="Password"
                                name="password"
                                placeholder="Enter password"
                                onChange={this.handleChange}
                                className="label-login-view"
                                type="password"
                                value={this.state.password}
                            />
                        </Form>
                        <Button className="btn-primary submit-button" onClick={LoginActions.handleSubmit}> Submit </Button>
                    </div>
                </div>
            </div>
        );
    }
};
