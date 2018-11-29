/**
 * Page for editing user variability
 */
import React from "react";
import Reflux from "reflux";
import LabeledInput from "../components/LabeledInput";
import constants from "../../constants/constants";
import { VariableStore, VariableActions } from "./VariabilityStore";
import { ToastContainer } from "react-toastify";
import { MemberActions } from "../members/MemberStore";
import { Tab, Tabs } from "react-bootstrap";
import ErrorAlert from "../components/ErrorAlert";

export default class EditVariabilityPage extends Reflux.Component {
    constructor() {
        super();

        this.store = VariableStore;
        this.onClickExecSaveButton = this.onClickExecSaveButton.bind(this);
        this.onClickMemberSaveButton = this.onClickMemberSaveButton.bind(this);
        this.getMemberSettingsTab = this.getMemberSettingsTab.bind(this);
        this.getExecSettingsTab = this.getExecSettingsTab.bind(this);
    }

    componentDidMount() {
        if (!this.state.fetchedSystemVariables) {
            VariableActions.fetchSystemVariables();
        }
    }

    // wrap the handle change event
    handleChangeWrapper(changeFunction) {
        return (event) => {
            const { name, value } = event.target;
            changeFunction({ name, value });
        };
    }

    onClickExecSaveButton() {
        VariableActions.saveExecSystemVariables();
    }

    onClickMemberSaveButton() {
        VariableActions.saveMemberSystemVariables();
    }

    getMemberSettingsTab(tabKey, onMemberChange, memberValues) {
        return (
            <Tab eventKey={tabKey} title="Member Settings">
                <div className="col-md-6 margin-top-2">
                    <LabeledInput
                        label="Max Reservation Length (1 to 27 days)"
                        name="maxReservationLength"
                        onChange={this.handleChangeWrapper(onMemberChange)}
                        value={memberValues.maxReservationLength}
                    />
                    <LabeledInput
                        label="Max Number of Items per Reservation (1 to 98 items)"
                        name="maxItemsReserved"
                        onChange={this.handleChangeWrapper(onMemberChange)}
                        value={memberValues.maxItemsReserved}
                    />
                    <LabeledInput
                        label="Max Days in Advance to Reserve (1 to 364 days)"
                        name="maxDaysInFutureCanStart"
                        onChange={this.handleChangeWrapper(onMemberChange)}
                        value={memberValues.maxDaysInFutureCanStart}
                    />
                    <LabeledInput
                        label="Max Number of Reservations (1 to 98 reservations)"
                        name="maxReservations"
                        onChange={this.handleChangeWrapper(onMemberChange)}
                        value={memberValues.maxReservations}
                    />
                    <button
                        className="btn btn-success submit-button"
                        onClick={this.onClickMemberSaveButton}
                    >
                            Save
                    </button>
                </div>
            </Tab>
        );
    }

    getExecSettingsTab(tabKey, onExecChange, execValues) {
        return (
            <Tab eventKey={tabKey} title="Executive Settings">
                <div className="col-md-6 margin-top-2">
                    <LabeledInput
                        label="Max Reservation Length (1 to 27 days)"
                        name="maxReservationLength"
                        onChange={this.handleChangeWrapper(onExecChange)}
                        value={execValues.maxReservationLength}
                    />
                    <LabeledInput
                        label="Max Number of Items per Reservation (1 to 98 items)"
                        name="maxItemsReserved"
                        onChange={this.handleChangeWrapper(onExecChange)}
                        value={execValues.maxItemsReserved}
                    />
                    <LabeledInput
                        label="Max Days in Advance to Reserve (1 to 364 days)"
                        name="maxDaysInFutureCanStart"
                        onChange={this.handleChangeWrapper(onExecChange)}
                        value={execValues.maxDaysInFutureCanStart}
                    />
                    <LabeledInput
                        label="Max Number of Reservations (1 to 98 reservations)"
                        name="maxReservations"
                        onChange={this.handleChangeWrapper(onExecChange)}
                        value={execValues.maxReservations}
                    />
                    <button
                        className="btn btn-success submit-button"
                        onClick={this.onClickExecSaveButton}
                    >
                            Save
                    </button>
                </div>
            </Tab>
        );
    }

    render() {
        const onExecChange = VariableActions.updateExecVariable,
            onMemberChange = VariableActions.updateMemberVariable,
            execValues = this.state.settings[constants.variability.EXECUTIVE],
            memberValues = this.state.settings[constants.variability.MEMBER];
        return (
            <div className="variability-view">
                <ToastContainer
                    className="reservation-success-toast"
                    position="top-center"
                    autoClose={4000}
                    hideProgressBar
                    closeOnClick
                    pauseOnVisibilityChange={false}
                    draggablePercent={80}
                    pauseOnHover={false}
                />
                <h3>Edit System Values</h3>
                <p>Here you can edit system values Member and Executive.</p>
                <ErrorAlert
                    show={this.state.fetchError}
                    errorMessage={this.state.fetchErrorMessage}
                />
                <Tabs activeKey={this.state.tabSelected}
                    onSelect={MemberActions.tabSelected}
                    id="member-view-tabs"
                >
                    {this.getMemberSettingsTab(1, onMemberChange, memberValues)}
                    {this.getExecSettingsTab(2, onExecChange, execValues)}
                </Tabs>
            </div>
        );
    }
}

EditVariabilityPage.propTypes = {};
