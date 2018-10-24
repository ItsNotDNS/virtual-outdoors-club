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
        error: "",
        categoryDropdown: {
            categorySelected: ""
        },
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
        },
        fetchedGearCategoryList: false,
        categoryList: [],
        categoryModal: {
            show: false,
            error: false,
            errorMessage: "",
            originalName: null,
            mode: null,
            category: ""
        },
        shoppingList: []
    };
}

// create actions and export them for use
export const GearActions = Reflux.createActions([
    "updateDropdown",
    "fetchGearList",
    "openGearModal",
    "gearModalChanged",
    "submitGearModal",
    "closeGearModal",
    "fetchGearCategoryList",
    "openCategoryModal",
    "categoryModalChanged",
    "submitCategoryModal",
    "closeCategoryModal",
    "addToShoppingCart",
    "removeFromShoppingCart"
]);

export class GearStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = GearActions; // listen for actions
    }

    // updates the selected object in the category dropdown
    onUpdateDropdown(value) {
        this.setState({
            categoryDropdown: { categorySelected: value }
        });
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
    onSetGearModalError(message) {
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
            this.onSetGearModalError("You need to select a category.");
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
                        this.onSetGearModalError(error);
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
                        this.onSetGearModalError(error);
                    }
                });
        }
    }

    // closes and returns the gear modal back to its default/closed values
    onCloseGearModal() {
        const newState = update(this.state, {
            gearModal: { $set: defaultState().gearModal }
        });
        this.setState(newState);
    }

    // gets the gear category list from the back-end and sets it in the state
    onFetchGearCategoryList() {
        const service = new GearService();

        // helps prevent calling this function too many times
        this.setState({ fetchedGearCategoryList: true });

        return service.fetchGearCategoryList()
            .then(({ data, error }) => {
                if (data) {
                    this.setState({
                        categoryList: data
                    });
                } else {
                    this.setState({
                        error
                    });
                }
            });
    }

    onOpenCategoryModal(mode = Constants.modals.CREATING, options = { category: {} }) {
        const { name } = options.category,
            newState = update(this.state, {
                categoryModal: {
                    show: { $set: true },
                    mode: { $set: mode },
                    originalName: { $set: name || null },
                    category: { $set: name || "" }
                }
            });
        this.setState(newState);
    }

    categoryModalChanged(field, value) {
        const newState = update(this.state, {
            categoryModal: {
                [field]: { $set: value }
            }
        });
        this.setState(newState);
    }

    onSetCategoryModalError(message) {
        const newState = update(this.state, {
            categoryModal: {
                error: { $set: true },
                errorMessage: { $set: message }
            }
        });
        this.setState(newState);
    }

    onSubmitCategoryModal() {
        const service = new GearService();

        if (this.state.categoryModal.category === "") {
            this.onSetCategoryModalError("You cannot leave the category name blank.");
            return;
        }

        if (this.state.categoryModal.mode === Constants.modals.CREATING) {
            // creating a new piece of gear
            return service.createCategory({ name: this.state.categoryModal.category })
                .then(({ category, error }) => {
                    if (category) {
                        const newState = update(this.state, {
                            categoryList: { $push: [category] }
                        });
                        this.setState(newState);
                        this.onCloseCategoryModal();
                    } else {
                        this.onSetCategoryModalError(error);
                    }
                });
        } else {
            // else: Not creating a category
            const { categoryModal: { originalName, category } } = this.state; // destructuring
            return service.updateCategory({ originalName, newName: category })
                .then(({ category, error }) => {
                    const { categoryList, categoryModal: { originalName } } = this.state; // destructuring

                    if (category) {
                        const indexToUpdate = categoryList.findIndex((obj) => obj.name === originalName),
                            newState = update(this.state, {
                                categoryList: {
                                    [indexToUpdate]: { $set: category }
                                }
                            });

                        this.setState(newState);
                        this.onCloseCategoryModal();
                        return this.onFetchGearList(); // easier to call this than update all the gear data
                    } else {
                        this.onSetCategoryModalError(error);
                    }
                });
        }
    }

    onCloseCategoryModal() {
        const newState = update(this.state, {
            categoryModal: { $set: defaultState().categoryModal }
        });
        this.setState(newState);
    }

    onAddToShoppingCart(row) {
        if (!this.state.shoppingList.includes(row)) {
            const newState = update(this.state, {
                shoppingList: { $push: [row] }
            });
            this.setState(newState);
        }
    }

    onRemoveFromShoppingCart({ id }) {
        const newState = update(this.state, {
            shoppingList: {
                $set: this.state.shoppingList.filter((obj) =>
                    id !== obj.id)
            }
        });
        this.setState(newState);
    }
}
