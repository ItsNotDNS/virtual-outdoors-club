/**
 * Manages the state for the User variability page
 */
import Reflux from "reflux";
import constants from "../../constants/constants";
import update from "immutability-helper";
import VariabilityService from "../../services/VariabilityService";
import { toast } from "react-toastify";

const { EXECUTIVE, MEMBER } = constants.variability,
    VariableActions = Reflux.createActions([
        "updateExecVariable",
        "updateMemberVariable",
        "saveSystemVariables",
        "fetchSystemVariables"
    ]);

export { VariableActions };

function defaultState() {
    return {
        settings: {
            [EXECUTIVE]: {
                maxReservationLength: 0,
                maxDaysInFutureCanStart: 0,
                maxItemsReserved: 0
            },
            [MEMBER]: {
                maxReservationLength: 0,
                maxDaysInFutureCanStart: 0,
                maxItemsReserved: 0
            }
        },
        error: false,
        fetchedSystemVariables: false
    };
};

export class VariableStore extends Reflux.Store {
    constructor() {
        super();

        this.state = defaultState();
        this.listenables = VariableActions;
        this.settingsMapping = this.settingsMapping.bind(this);
    }

    updateVariable(type, change) {
        const newState = update(this.state, {
            settings:
                {
                    [type]: {
                        [change.name]: { $set: parseInt(change.value) }
                    }
                }
        });
        this.setState(newState);
    }

    // change: { name, value }
    onUpdateExecVariable(change) {
        this.updateVariable(EXECUTIVE, change);
    }

    // change: { name, value }
    onUpdateMemberVariable(change) {
        this.updateVariable(MEMBER, change);
    }

    settingsMapping() {
        return {
            executivemaxRentals: [EXECUTIVE, "maxItemsReserved"],
            executivemaxLength: [EXECUTIVE, "maxReservationLength"],
            executivemaxFuture: [EXECUTIVE, "maxDaysInFutureCanStart"],
            membermaxRentals: [MEMBER, "maxItemsReserved"],
            membermaxLength: [MEMBER, "maxReservationLength"],
            membermaxFuture: [MEMBER, "maxDaysInFutureCanStart"]
        };
    }

    onFetchSystemVariables() {
        const service = new VariabilityService();
        this.setState({
            fetchedSystemVariables: true
        });
        return service.fetchSystemVariables()
            .then(({ data, error }) => {
                if (error) {
                    const newState = update(this.state, {
                        error: { $set: true },
                        errorMessage: { $set: error }
                    });
                    this.setState(newState);
                } else {
                    data.forEach((setting) => {
                        const [type, name] = this.settingsMapping()[setting.variable],
                            newState = update(this.state, {
                                settings: {
                                    [type]: {
                                        [name]: { $set: setting.value }
                                    }
                                }
                            });
                        this.setState(newState);
                    });
                }
            });
    }

    onSaveSystemVariables() {
        const service = new VariabilityService();
        return service.setSystemVariables(this.state.settings)
            .then(({ error }) => {
                if (error) {
                    const newState = update(this.state, {
                        error: { $set: true }
                    });
                    this.setState(newState);
                    toast.error(error, { className: "custom-error-toast" });
                } else {
                    toast.success("Values changed successfully",
                        { className: "custom-success-toast" }
                    );
                }
            });
    }
}
