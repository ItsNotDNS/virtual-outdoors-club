/**
 * Manages the state for the Manage Account page
 */

import Reflux from "reflux";
import constants from "../../constants/constants";
import update from "immutability-helper";

function defaultState() {
    return {
        timeout: null,
        [ADMIN]: {
            oldAdmin: "",
            newAdmin: "",
            confirmAdmin: "",
            canSubmit: false
        },
        [EXECUTIVE]: {
            newExec: "",
            confirmExec: "",
            canSubmit: false
        }
    };
}

const { ADMIN, EXECUTIVE } = constants.accounts,
    AccountsActions = Reflux.createActions([
        "updateExecVariable",
        "updateAdminVariable"
    ]);

export { AccountsActions };

export class AccountsStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = AccountsActions; // listen for actions

        this.checkIfValid = this.checkIfValid.bind(this);
    }

    checkIfValid() {
        const { oldAdmin, newAdmin, confirmAdmin } = this.state[ADMIN],
            { newExec, confirmExec } = this.state[EXECUTIVE];

        this.setState({ timeout: null });

        // if the fields oldAdmin, newAdmin, confirmAdmin are filled in
        if (oldAdmin && newAdmin && confirmAdmin) {
            if (newAdmin !== confirmAdmin) {
                this.setState(update(this.state, {
                    [ADMIN]: {
                        error: { $set: "The passwords do not match." },
                        canSubmit: { $set: false }
                    }
                }));
            } else {
                this.setState(update(this.state, {
                    [ADMIN]: {
                        canSubmit: { $set: true }
                    }
                }));
            }
        }

        if (newExec && confirmExec) {
            if (newExec !== confirmExec) {
                this.setState(update(this.state, {
                    [EXECUTIVE]: {
                        error: { $set: "The passwords do not match." },
                        canSubmit: { $set: false }
                    }
                }));
            } else {
                this.setState(update(this.state, {
                    [EXECUTIVE]: {
                        canSubmit: { $set: true }
                    }
                }));
            }
        }
    }

    updateVariable(type, change) {
        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }

        const timeout = setTimeout(this.checkIfValid, 400),
            newState = update(this.state, {
                timeout: { $set: timeout },
                [type]: {
                    [change.name]: { $set: change.value.trim() },
                    canSubmit: { $set: false },
                    error: { $set: "" }
                }
            });
        this.setState(newState);
    }

    // change: { name, value }
    onUpdateExecVariable(change) {
        this.updateVariable(EXECUTIVE, change);
    }

    // change: { name, value }
    onUpdateAdminVariable(change) {
        this.updateVariable(ADMIN, change);
    }
}
