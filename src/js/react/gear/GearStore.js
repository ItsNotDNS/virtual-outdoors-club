import Reflux from "reflux";
import GearService from "../../services/GearService";

function defaultState() {
    return {
        fetchedGearList: false, // inital check to fetch the gear list
        error: false,
        gearList: []
    };
}

// create actions
export const GearActions = Reflux.createActions([
    "reset", "fetchGearList"
]);

export class GearStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = GearActions; // listen for actions
    }

    onReset() {
        this.setState(defaultState());
    }

    onFetchGearList() {
        const service = new GearService();

        this.setState({
            fetchedGearList: true
        });

        service.fetchGearList()
            .then((data) => {
                this.setState({
                    gearList: data
                });
            })
            .catch((error) => {
                console.error("There was an error fetching the gear list.");
                this.setState({ error });
            });
    }
};
