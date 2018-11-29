/**
 *Page for "Manage Account" with two tabs
 * for changing password for execs, admins
 */

import React from "react";
import Reflux from "reflux";
import { Tabs, Tab, Alert } from "react-bootstrap";
import LabeledInput from "../components/LabeledInput";
import { AccountsStore, AccountsActions } from "./AccountsStore";
import constants from "../../constants/constants";

const {
    ADMIN,
    EXECUTIVE
} = constants.accounts;

export default class AccountsPage extends Reflux.Component {
    constructor() {
        super();

        this.store = AccountsStore;

        this.getExecTab = this.getExecTab.bind(this);
        this.getAdminTab = this.getAdminTab.bind(this);
    }

    handleChangeWrapper(changeFunc) {
        return (event) => {
            const { name, value } = event.target;
            changeFunc({ name, value });
        };
    }

    getErrorAlert(error) {
        if (error) {
            return (
                <Alert bsSize="warning">
                    <h4>Cannot save new password.</h4>
                    <strong>{error}</strong>
                </Alert>
            );
        }
    }

    getExecTab(tabKey) {
        const { updateExecVariable } = AccountsActions,
            execValues = this.state[EXECUTIVE],
            { message, error } = this.state,
            alert = this.getPasswordAlert(error) ||
                this.getPasswordMessage(message);

        return (
            <Tab title="Executive" eventKey={tabKey}>
                <div className="col-md-6 margin-top-2">
                    {this.getErrorAlert(execValues.error) || alert}
                    <LabeledInput
                        name="newExec"
                        label="New Password"
                        type="password"
                        onChange={this.handleChangeWrapper(updateExecVariable)}
                        value={execValues.newExec}
                    />
                    <LabeledInput
                        name="confirmExec"
                        label="Confirm Password"
                        type="password"
                        onChange={this.handleChangeWrapper(updateExecVariable)}
                        value={execValues.confirmExec}
                    />
                    <div className="text-center">
                        <button
                            className="btn btn-success submit-button"
                            disabled={!execValues.canSubmit}
                            onClick={AccountsActions.updateExecutivePassword}
                        >
                                    Save
                        </button>
                    </div>
                </div>
            </Tab>
        );
    }

    getPasswordAlert(error) {
        if (error) {
            return (
                <Alert bsStyle="danger">
                    <h4>Invalid credentials, please try again.</h4>
                </Alert>
            );
        }
    }

    getPasswordMessage(message) {
        if (message) {
            return (
                <Alert bsStyle="success">
                    <h4>{message}</h4>
                </Alert>
            );
        }
    }

    getAdminTab(tabKey) {
        const { updateAdminVariable } = AccountsActions,
            { message, error } = this.state,
            adminValues = this.state[ADMIN],
            alert = this.getPasswordAlert(error) ||
                this.getPasswordMessage(message);

        return (
            <Tab title="Admin" eventKey={tabKey}>
                <div className="col-md-6 margin-top-2">
                    {alert || this.getErrorAlert(adminValues.error)}
                    <LabeledInput
                        name="oldAdmin"
                        label="Old Password"
                        type="password"
                        onChange={this.handleChangeWrapper(updateAdminVariable)}
                        value={adminValues.oldAdmin}
                    />
                    <LabeledInput
                        name="newAdmin"
                        label="New Password"
                        type="password"
                        onChange={this.handleChangeWrapper(updateAdminVariable)}
                        value={adminValues.newAdmin}
                    />
                    <LabeledInput
                        name="confirmAdmin"
                        label="Confirm Password"
                        type="password"
                        onChange={this.handleChangeWrapper(updateAdminVariable)}
                        value={adminValues.confirmAdmin}
                    />
                    <div className="text-center">
                        <button
                            className="btn btn-success submit-button"
                            disabled={!adminValues.canSubmit}
                            onClick={AccountsActions.updateAdminPassword}
                        >
                                    Save
                        </button>
                    </div>
                </div>
            </Tab>
        );
    }

    render() {
        return (
            <div className="accounts-view">
                <h3>Edit Account Passwords</h3>
                <p>Here you can edit the passwords for the Admin and Executive accounts.</p>
                <Tabs id="accounts-view-tabs">
                    {this.getAdminTab(1)}
                    {this.getExecTab(2)}
                </Tabs>
            </div>
        );
    }
}
