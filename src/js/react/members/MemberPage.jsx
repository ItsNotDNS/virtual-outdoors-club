import React from "react";
import Reflux from "reflux";
import { MemberStore, MemberActions } from "./MemberStore";
import { Alert, Tabs, Tab } from "react-bootstrap";
import FileButton from "../components/FileButton";
import MemberTable from "./MemberTable";

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
            return <h3 className="loading-message">Loading...</h3>;
        } else if (fetchedMemberList && !memberList.length) {
            return (
                <div className="no-members-message">
                    <h3>You have no members!</h3>
                    <p>You can upload a member file under the "Upload" tab.</p>
                </div>
            );
        } else if (fetchedMemberList && memberList.length) {
            return <MemberTable memberList={memberList} />;
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
                <FileButton
                    onFileSelected={MemberActions.fileSelected}
                    placeholder={"You can update your member list by uploading your member file here."}
                />
                <div className="text-center">
                    <button
                        className="btn btn-success submit-button"
                        disabled={!members.length}
                        onClick={MemberActions.uploadMemberFile}
                    >
                            Upload
                    </button>
                </div>
            </div>
        );
    }

    getPageError(error) {
        if (error) {
            return (
                <Alert bsStyle="success">
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
                    <Tab eventKey={2} title="Upload">
                        {this.getUploadTab()}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
