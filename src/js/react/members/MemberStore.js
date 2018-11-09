/**
 * Manages the state for the Member page.
 */
import Reflux from "reflux";
import update from "immutability-helper";
import MemberService from "../../services/MemberService";

function defaultState() {
    return {
        tabSelected: 1,
        error: "",
        fetchingMemberList: false,
        fetchedMemberList: false,
        memberList: [],
        fetchingBlacklist: false,
        fetchedBlacklist: false,
        blacklist: [],
        upload: {
            displaySuccess: false,
            members: [],
            warnings: [],
            error: ""
        }
    };
}

export const MemberActions = Reflux.createActions([
    "tabSelected",
    "fileSelected",
    "uploadMemberFile",
    "addToBlacklist",
    "removeFromBlacklist"
]);

export class MemberStore extends Reflux.Store {
    constructor(options = {}) {
        super();
        this.state = defaultState();
        this.listenables = MemberActions; // listen for actions

        // fetch member list when constructing store, unless explicitly stated
        if (options.fetchOnConstruct !== false) {
            this.fetchMemberList();
            this.fetchBlacklist();
        }
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

    fetchBlacklist() {
        const service = new MemberService();

        this.setState({
            fetchingBlacklist: true,
            fetchedBlacklist: false
        });

        return service.getBlacklist()
            .then(({ members, error }) => {
                let newState;
                if (error) {
                    newState = update(this.state, {
                        error: { $set: error },
                        fetchingBlacklist: { $set: false },
                        fetchedBlacklist: { $set: true }
                    });
                } else {
                    newState = update(this.state, {
                        blacklist: { $set: members },
                        fetchingBlacklist: { $set: false },
                        fetchedBlacklist: { $set: true }
                    });
                }
                this.setState(newState);
            });
    }

    fetchMemberList() {
        const service = new MemberService();

        this.setState({
            fetchingMemberList: true,
            fetchedMemberList: false
        });

        return service.getMemberList()
            .then(({ members, error }) => {
                let newState;
                if (error) {
                    newState = update(this.state, {
                        error: { $set: error },
                        fetchingMemberList: { $set: false },
                        fetchedMemberList: { $set: true }
                    });
                } else {
                    newState = update(this.state, {
                        memberList: { $set: members },
                        fetchingMemberList: { $set: false },
                        fetchedMemberList: { $set: true }
                    });
                }
                this.setState(newState);
            });
    }

    onUploadMemberFile() {
        const service = new MemberService(),
            memberList = this.state.upload.members;

        if (memberList.length) {
            return service.uploadMemberList(memberList)
                .then(({ members, error }) => {
                    let newState;
                    if (error) {
                        newState = update(this.state, {
                            upload: {
                                error: { $set: error }
                            }
                        });
                    } else {
                        newState = update(this.state, {
                            upload: {
                                displaySuccess: { $set: true }
                            },
                            memberList: { $set: members }
                        });
                    }
                    this.setState(newState);
                });
        }
    }

    onAddToBlacklist(memberToBlacklist) {
        const service = new MemberService();

        return service.blacklistMember(memberToBlacklist)
            .then(({ error, blacklistedMember }) => {
                const { memberList } = this.state;
                if (error) {
                    this.setState(update(this.state, {
                        error: { $set: error }
                    }));
                } else {
                    // remove member from local memberList (filter), add member to local blacklist
                    this.setState(update(this.state, {
                        memberList: { $set: memberList.filter((member) => member.email !== blacklistedMember.email) },
                        blacklist: { $push: [blacklistedMember] }
                    }));
                }
            });
    }

    onRemoveFromBlacklist({ email }) {
        const service = new MemberService();

        return service.whitelistMember(email)
            .then(({ error }) => {
                const { blacklist } = this.state;
                if (error) {
                    this.setState(update(this.state, {
                        error: { $set: error }
                    }));
                } else {
                    // remove member from blacklist
                    this.setState(update(this.state, {
                        blacklist: { $set: blacklist.filter((member) => member.email !== email) }
                    }));
                    this.fetchMemberList(); // fetch the member list, because it could have changed (can't detect)
                }
            });
    }
}
