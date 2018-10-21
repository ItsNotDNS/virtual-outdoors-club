/**
 * Manages the state for the GearPage, primarily.
 */

import Reflux from "reflux";
import GearService from "../../services/GearService";
import update from "immutability-helper";
import Constants from "../../constants/constants";

function defaultState() {
    return {
        fetchedGearList: false, // initial check to fetch the gear list
        error: false,
        gearList: [],
        gearModal: {
            show: false,
            error: false,
            errorMessage: "",
            mode: null,
            id: null,
            expectedVersion: null,
            gearCode: "",
            depositFee: "",
            gearCategory: "",
            gearDescription: ""
        }
    };
}

// create actions and export them for use
export const GearActions = Reflux.createActions([
    "fetchGearList",
    "openGearModal",
    "gearModalChanged",
    "submitGearModal",
    "closeGearModal"
]);

export class GearStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = GearActions; // listen for actions
    }

    onFetchGearList() {
        const service = new GearService();

        this.setState({
            fetchedGearList: true
        });

        return service.fetchGearList()
            .then(({ data, error }) => {
                if (data) {
                    this.setState({
                        gearList: data
                    });
                } else {
                    this.setState({
                        error
                    });
                }
            });
    }

    // opens the gear modal, mode is to specify if the modal is for creating or editing gear
    onOpenGearModal(mode = Constants.modals.CREATING, options = { gear: {} }) {
        const { id, expectedVersion, gearCode, depositFee, gearCategory, gearDescription } = options.gear,
            newState = update(this.state, {
                gearModal: {
                    show: { $set: true },
                    mode: { $set: mode },
                    id: { $set: id || null },
                    expectedVersion: { $set: expectedVersion || null },
                    gearCode: { $set: gearCode || "" },
                    depositFee: { $set: depositFee || "" },
                    gearCategory: { $set: gearCategory || "" },
                    gearDescription: { $set: gearDescription || "" }
                }
            });
        this.setState(newState);
    }

    // updates the field values of the gearModal
    onGearModalChanged(field, value) {
        const newState = update(this.state, {
            gearModal: {
                [field]: { $set: value }
            }
        });
        this.setState(newState);
    }

    // sets an error for the gearModal (i.e. no internet, etc)
    onSetModalError(message) {
        const newState = update(this.state, {
            gearModal: {
                error: { $set: true },
                errorMessage: { $set: message }
            }
        });
        this.setState(newState);
    }

    // tries to submit the data in the gearModal for creating/editing gear
    onSubmitGearModal() {
        const service = new GearService();

        if (this.state.gearModal.gearCategory === "") {
            this.onSetModalError("You need to select a category.");
            return;
        }

        if (this.state.gearModal.mode === Constants.modals.CREATING) {
            // creating a new piece of gear
            return service.createGear({ ...this.state.gearModal })
                .then(({ gear, error }) => {
                    if (gear) {
                        const newState = update(this.state, {
                            gearList: { $push: [gear] }
                        });
                        this.setState(newState);
                        this.onCloseGearModal();
                    } else {
                        this.onSetModalError(error);
                    }
                });
        } else {
            // else: Not creating a new piece of gear
            return service.updateGear({ ...this.state.gearModal })
                .then(({ gear, error }) => {
                    if (gear) {
                        const indexToUpdate = this.state.gearList.findIndex((obj) => obj.id === gear.id),
                            newState = update(this.state, {
                                gearList: {
                                    [indexToUpdate]: { $set: gear }
                                }
                            });

                        this.setState(newState);
                        this.onCloseGearModal();
                    } else {
                        this.onSetModalError(error);
                    }
                });
        }
    }

    // closes and returns the gear modal back to its default/closed values
    onCloseGearModal() {
        const newState = update(this.state, {
            gearModal: {
                show: { $set: false },
                error: { $set: false },
                errorMessage: { $set: "" },
                mode: { $set: null },
                id: { $set: null },
                expectedVersion: { $set: null },
                gearCode: { $set: "" },
                depositFee: { $set: "" },
                gearCategory: { $set: "" },
                gearDescription: { $set: "" }
            }
        });
        this.setState(newState);
    }
}
