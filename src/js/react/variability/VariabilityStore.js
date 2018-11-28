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
        "saveExecSystemVariables",
        "fetchSystemVariables",
        "saveMemberSystemVariables"
    ]);

export { VariableActions };

function defaultState() {
    return {
        settings: {
            [EXECUTIVE]: {
                maxReservationLength: 0,
                maxDaysInFutureCanStart: 0,
                maxItemsReserved: 0,
                maxReservations: 0
            },
            [MEMBER]: {
                maxReservationLength: 0,
                maxDaysInFutureCanStart: 0,
                maxItemsReserved: 0,
                maxReservations: 0
            }
        },
        fetchError: false,
        fetchErrorMessage: "",
        error: false,
        errorMessage: "",
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
            executivemaxGearPerReservation: [EXECUTIVE, "maxItemsReserved"],
            executivemaxLength: [EXECUTIVE, "maxReservationLength"],
            executivemaxFuture: [EXECUTIVE, "maxDaysInFutureCanStart"],
            executivemaxReservations: [EXECUTIVE, "maxReservations"],
            membermaxGearPerReservation: [MEMBER, "maxItemsReserved"],
            membermaxLength: [MEMBER, "maxReservationLength"],
            membermaxFuture: [MEMBER, "maxDaysInFutureCanStart"],
            membermaxReservations: [MEMBER, "maxReservations"]
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
                        fetchError: { $set: true },
                        fetchErrorMessage: { $set: error }
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

    onSaveMemberSystemVariables() {
        const service = new VariabilityService();
        return service.setMemberSystemVariables(this.state.settings)
            .then(({ error }) => {
                if (error) {
                    const newState = update(this.state, {
                        error: { $set: true },
                        errorMessage: { $set: error }
                    });
                    this.setState(newState);
                    toast.error(error, { className: "custom-error-toast" });
                } else {
                    toast.success("Member settings changed successfully",
                        { className: "custom-success-toast" }
                    );
                }
            });
    }

    onSaveExecSystemVariables() {
        const service = new VariabilityService();
        return service.setExecSystemVariables(this.state.settings)
            .then(({ error }) => {
                if (error) {
                    const newState = update(this.state, {
                        error: { $set: true },
                        errorMessage: { $set: error }
                    });
                    this.setState(newState);
                    toast.error(error, { className: "custom-error-toast" });
                } else {
                    toast.success("Exec settings changed successfully",
                        { className: "custom-success-toast" }
                    );
                }
            });
    }
}
