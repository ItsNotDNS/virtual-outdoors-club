/**
 * Manages the state for GearCategories
 * maybe should be merged with the GearStore...
 */

import Reflux from "reflux";
import GearService from "../../services/GearService";

function defaultState() {
    return {
        fetchedGearCategoryList: false,
        categoryList: [],
        error: false,
        dropdown: {
            categorySelected: ""
        }
    };
};

export const GearCategoryActions = Reflux.createActions([
    "updateDropdown",
    "fetchGearCategoryList",
    "setShowAddModal",
    "createGearCategory"
]);

export class GearCategoryStore extends Reflux.Store {
    constructor() {
        super();

        this.state = defaultState();
        this.listenables = GearCategoryActions;
    }

    // updates the selected object in the dropdown
    onUpdateDropdown(value) {
        this.setState({
            dropdown: { categorySelected: value }
        });
    }

    // gets the gear category list from the back-end and sets it in the state
    onFetchGearCategoryList() {
        const service = new GearService();

        // helps prevent calling this function too many times
        this.setState({ fetchedGearCategoryList: true });

        return service.fetchGearCategoryList()
            .then((categories) => {
                // todo: handle error case like in GearStore
                this.setState({ categoryList: categories });
            });
    }
}
