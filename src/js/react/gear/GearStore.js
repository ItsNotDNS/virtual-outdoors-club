import Reflux from "reflux";
import GearService from "../../services/GearService";

// create actions
export const GearActions = Reflux.createActions([
    "fetchGearList"
]);

export class GearStore extends Reflux.Store {
    constructor() {
        super();
        this.state = {
            fetchedGearList: false, // inital check to fetch the gear list
            gearList: []
        };
        this.listenables = GearActions; // listen for actions
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
            .catch(() => {
                console.error("There was an error fetching the gear list.");
            });
    }
};
