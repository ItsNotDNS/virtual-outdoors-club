import Reflux from "reflux";
import update from "immutability-helper";
import MemberService from "../../services/MemberService";

function defaultState() {
    return {
        tabSelected: 1,
        memberList: [],
        upload: {
            members: [],
            warnings: [],
            error: ""
        }
    };
}

export const MemberActions = Reflux.createActions([
    "tabSelected",
    "fileSelected"
]);

export class MemberStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = MemberActions; // listen for actions
    }

    onTabSelected(tab) {
        const newState = update(this.state, {
            tabSelected: { $set: tab }
        });
        this.setState(newState);
    }

    onFileSelected(file) {
        const service = new MemberService(),
            newState = update(this.state, {
                upload: { $set: defaultState().upload }
            });

        this.setState(newState); // prevent accidentally propagating old info

        if (file) {
            return service.parseMemberFile(file)
                .then(({ members, warnings }) => {
                    const newState = update(this.state, {
                        upload: {
                            members: { $set: members },
                            warnings: { $set: warnings }
                        }
                    });
                    this.setState(newState);
                })
                .catch((error) => {
                    const newState = update(this.state, {
                        upload: {
                            error: { $set: error.toString() }
                        }
                    });
                    this.setState(newState);
                });
        }
    }
}
