/**
 * Page for editing user variability
 */
import React from "react";
import Reflux from "reflux";
import LabeledInput from "../components/LabeledInput";
import constants from "../../constants/constants";
import { VariableStore, VariableActions } from "./VariabilityStore";
import { ToastContainer } from "react-toastify";

export default class EditVariabilityPage extends Reflux.Component {
    constructor() {
        super();

        this.store = VariableStore;
        this.onClickSaveButton = this.onClickSaveButton.bind(this);
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

    onClickSaveButton() {
        VariableActions.saveSystemVariables();
    }

    render() {
        const onExecChange = VariableActions.updateExecVariable,
            onMemberChange = VariableActions.updateMemberVariable,
            execValues = this.state.settings[constants.variability.EXECUTIVE],
            memberValues = this.state.settings[constants.variability.MEMBER];

        return (
            <div className="variability-view">
                <div className="row">
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
                    <div className="col-md-6">
                        <h4>Member Settings</h4>
                        <LabeledInput
                            label="Max Reservation Length (days)"
                            name="maxReservationLength"
                            onChange={this.handleChangeWrapper(onMemberChange)}
                            value={memberValues.maxReservationLength}
                        />
                        <LabeledInput
                            label="Max Number of Items on Reservation"
                            name="maxItemsReserved"
                            onChange={this.handleChangeWrapper(onMemberChange)}
                            value={memberValues.maxItemsReserved}
                        />
                        <LabeledInput
                            label="Max Days in Future can Reserve"
                            name="maxDaysInFutureCanStart"
                            onChange={this.handleChangeWrapper(onMemberChange)}
                            value={memberValues.maxDaysInFutureCanStart}
                        />
                    </div>
                    <div className="col-md-6">
                        <h4>Executive Settings</h4>
                        <LabeledInput
                            label="Max Reservation Length (days)"
                            name="maxReservationLength"
                            onChange={this.handleChangeWrapper(onExecChange)}
                            value={execValues.maxReservationLength}
                        />
                        <LabeledInput
                            label="Max Number of Items on Reservation"
                            name="maxItemsReserved"
                            onChange={this.handleChangeWrapper(onExecChange)}
                            value={execValues.maxItemsReserved}
                        />
                        <LabeledInput
                            label="Max Days in Future can Reserve"
                            name="maxDaysInFutureCanStart"
                            onChange={this.handleChangeWrapper(onExecChange)}
                            value={execValues.maxDaysInFutureCanStart}
                        />
                    </div>
                </div>
                <div className="text-center">
                    <button
                        className="btn btn-success submit-button"
                        onClick={this.onClickSaveButton}
                    >
                            Save
                    </button>
                </div>
            </div>
        );
    }
}

EditVariabilityPage.propTypes = {};
