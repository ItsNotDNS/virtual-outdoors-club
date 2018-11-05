import Reflux from "reflux";
import constants from "../../constants/constants";
import update from "immutability-helper";

const { EXECUTIVE, MEMBER } = constants.variability,
    VariableActions = Reflux.createActions([
        "updateExecVariable",
        "updateMemberVariable"
    ]);

export { VariableActions };

function defaultState() {
    return {
        [EXECUTIVE]: {
            maxReservationLength: 14,
            maxDaysInFutureCanStart: 14,
            maxItemsReserved: 5
        },
        [MEMBER]: {
            maxReservationLength: 30,
            maxDaysInFutureCanStart: 60,
            maxItemsReserved: 20
        }
    };
};

export class VariableStore extends Reflux.Store {
    constructor() {
        super();

        this.state = defaultState();
        this.listenables = VariableActions;
    }

    updateVariable(type, change) {
        const newState = update(this.state, {
            [type]: {
                [change.name]: { $set: change.value }
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
}
