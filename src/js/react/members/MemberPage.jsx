/**
 * Wrapper for Member page with 2 tabs.
 * Member tab: tab to view the list of members
 * Upload tab: tab to upload a member list file
 */

import React from "react";
import Reflux from "reflux";
import { MemberStore, MemberActions } from "./MemberStore";
import { Alert, Tabs, Tab } from "react-bootstrap";
import FileButton from "../components/FileButton";
import MemberTable from "./MemberTable";
import BlacklistTable from "./BlacklistTable";

export default class MemberPage extends Reflux.Component {
    constructor() {
        super();

        this.getUploadTab = this.getUploadTab.bind(this);
        this.getMembersTab = this.getMembersTab.bind(this);

        this.store = MemberStore;
    }

    getErrorAlert(error) {
        if (error) {
            return (
                <Alert bsStyle="danger">
                    <h4>You cannot upload this file.</h4>
                    <p>{error}</p>
                </Alert>
            );
        }
    }

    getWarningAlert(warnings) {
        if (warnings.length > 0) {
            const children = warnings.map((w, i) => <li key={i}>{w}</li>);
            return (
                <Alert bsStyle="warning">
                    <h4>The file you are uploading had some inconsistencies.</h4>
                    <p><strong>You can still upload this file.</strong></p>
                    <p>However, you may want to check out the following rows:</p>
                    <ul>{children}</ul>
                </Alert>
            );
        }
    }

    getInfoAlert(members) {
        if (members.length) {
            return (
                <Alert bsStyle="info">
                    <h4>Looking Good!</h4>
                    <p>{`Clicking upload below will set the ${members.length} members listed in the file as your current members.`}</p>
                </Alert>
            );
        }
    }

    getSuccessAlert(show) {
        if (show) {
            return (
                <Alert bsStyle="success">
                    <h4>File Successfully Uploaded!</h4>
                    <p>Your member list is now updated.</p>
                </Alert>
            );
        }
    }

    getMembersTab() {
        const { memberList, fetchingMemberList, fetchedMemberList } = this.state;

        if (fetchingMemberList) {
            return <h3 className="member-loading-message">Loading...</h3>;
        } else if (fetchedMemberList && !memberList.length) {
            return (
                <div className="no-members-message">
                    <h3>You have no members!</h3>
                    <p>You can upload a member file under the "Upload" tab.</p>
                </div>
            );
        } else if (fetchedMemberList && memberList.length) {
            return (
                <div>
                    <h2>Member List</h2>
                    <p>These are the members that can reserve gear.</p>
                    <MemberTable
                        memberList={memberList}
                        addToBlacklist={MemberActions.addToBlacklist}
                    />
                </div>
            );
        }
    }

    getBlackListTab() {
        const { blacklist, fetchingBlacklist, fetchedBlacklist } = this.state;

        if (fetchingBlacklist) {
            return <h3 className="blacklist-loading-message">Loading...</h3>;
        } else if (fetchedBlacklist && !blacklist.length) {
            return (
                <div className="no-blacklist-message">
                    <h3>You have no blacklisted members!</h3>
                    <p>You can add a blacklisted member by pressing the add button on the right side of the member's table.</p>
                </div>
            );
        } else if (fetchedBlacklist && blacklist.length) {
            return (
                <div>
                    <h2>Blacklist</h2>
                    <p>Here are the emails that cannot reserve gear, regardless of if they are on your member list.</p>
                    <BlacklistTable
                        memberList={blacklist}
                        removeFromBlacklist={MemberActions.removeFromBlacklist}
                    />
                </div>
            );
        }
    }

    getUploadTab() {
        const { members, warnings, error, displaySuccess } = this.state.upload,
            alert = this.getErrorAlert(error) ||
                this.getSuccessAlert(displaySuccess) ||
                this.getWarningAlert(warnings) ||
                this.getInfoAlert(members);

        return (
            <div>
                {alert}
                <div className="row bottom-margin">
                    <div className="col-md-6 col-xs-12">
                        <FileButton
                            onFileSelected={MemberActions.fileSelected}
                            placeholder={"You can update your member list by uploading your member file here."}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 col-xs-4">
                        <button className="btn btn-success full-width"
                            disabled={!members.length}
                            onClick={MemberActions.uploadMemberFile}
                        >
                                Upload
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    getPageError(error) {
        if (error) {
            return (
                <Alert bsStyle="danger">
                    <h4>There was an Error.</h4>
                    <p>{error}</p>
                </Alert>
            );
        }
    }

    render() {
        const { error } = this.state;

        return (
            <div className="member-view">
                {this.getPageError(error)}
                <Tabs activeKey={this.state.tabSelected}
                    onSelect={MemberActions.tabSelected}
                    id="member-view-tabs"
                >
                    <Tab eventKey={1} title="Members">
                        {this.getMembersTab()}
                    </Tab>
                    <Tab eventKey={2} title="Blacklist">
                        {this.getBlackListTab()}
                    </Tab>
                    <Tab eventKey={3} title="Upload">
                        {this.getUploadTab()}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
