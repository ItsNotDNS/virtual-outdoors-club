/**
 * Manages the state for the Statistics page
 */
import Reflux from "reflux";
import StatisticService from "../../services/StatisticService";

function defaultState() {
    return {
        fetchedGearStatList: false,
        gearStatList: [],
        fetchedCategoryStatList: false,
        categoryStatList: [],
        error: ""
    };
}

export const StatisticActions = Reflux.createActions([
    "fetchGearStatisticList",
    "fetchCategoryStatisticList"
]);

export class StatisticStore extends Reflux.Store {
    constructor() {
        super();

        this.state = defaultState();
        this.listenables = StatisticActions;
    }

    onFetchGearStatisticList() {
        const service = new StatisticService();

        return service.fetchGearStatisticList()
            .then(({ data, error }) => {
                if (data) {
                    this.setState({
                        gearStatList: data,
                        fetchedGearStatList: true
                    });
                } else {
                    this.setState({
                        error,
                        fetchedGearStatList: true
                    });
                }
            });
    }

    onFetchCategoryStatisticList() {
        const service = new StatisticService();

        return service.fetchCategoryStatisticList()
            .then(({ data, error }) => {
                if (data) {
                    this.setState({
                        categoryStatList: data,
                        fetchedCategoryStatList: true
                    });
                } else {
                    this.setState({
                        error,
                        fetchedCategoryStatList: true
                    });
                }
            });
    }
}
