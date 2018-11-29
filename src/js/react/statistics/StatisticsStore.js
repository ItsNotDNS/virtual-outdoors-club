/**
 * Manages the state for the Statistics page
 */
import Reflux from "reflux";
import StatisticService from "../../services/StatisticService";
import update from "immutability-helper";
import moment from "moment";

function defaultState() {
    return {
        fetchedStatistics: false,
        gearStatList: [],
        categoryStatList: [],
        error: "",
        dateFilter: {
            startDate: moment(moment().subtract(4, "d").format("YYYY-MM-DD")).toDate(),
            endDate: moment(moment().format("YYYY-MM-DD")).toDate()
        }
    };
}

export const StatisticActions = Reflux.createActions([
    "fetchStatistics",
    "dateFilterChanged"
]);

export class StatisticStore extends Reflux.Store {
    constructor() {
        super();

        this.state = defaultState();
        this.listenables = StatisticActions;
    }

    onDateFilterChanged({ startDate, endDate }) {
        const dateFilter = {};
        if (startDate) {
            dateFilter.startDate = { $set: startDate };
        }
        if (endDate) {
            dateFilter.endDate = { $set: endDate };
        }
        this.setState(update(this.state, { dateFilter }));
        this.onFetchStatistics();
    }

    onFetchStatistics() {
        const { startDate, endDate } = this.state.dateFilter,
            service = new StatisticService();

        return service.fetchStatisticsFromTo(
            moment(startDate).format("YYYY-MM-DD"),
            moment(endDate).format("YYYY-MM-DD")
        )
            .then(({ gear, category, error }) => {
                if (error) {
                    this.setState({
                        error,
                        fetchedStatistics: true
                    });
                } else {
                    this.setState({
                        error: "",
                        gearStatList: gear,
                        categoryStatList: category,
                        fetchedStatistics: true
                    });
                }
            });
    }
}
