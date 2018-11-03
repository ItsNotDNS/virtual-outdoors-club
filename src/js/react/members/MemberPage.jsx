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

    getSuccessAlert(members) {
        if (members.length) {
            return (
                <Alert bsStyle="success">
                    <h4>Looking Good!</h4>
                    <p>{`Clicking upload below will set the ${members.length} members listed in the file as your current members.`}</p>
                </Alert>
            );
        }
    }

    getMembersTab() {
        const mockData = [{
            email: "fake@test.com"
        }, {
            email: "ok@go.com"
        }];
        return (
            <MemberTable memberList={mockData} />
        );
    }

    getUploadTab() {
        const { members, warnings, error } = this.state.upload,
            alert = this.getErrorAlert(error) ||
                this.getWarningAlert(warnings) ||
                this.getSuccessAlert(members);

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
                    >
                            Upload
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="member-view">
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
