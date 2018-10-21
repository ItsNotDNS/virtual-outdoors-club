/**
 * Home page for gear management. Contains the list of gear,
 * add gear button, and edit/delete gear actions
 */

import React from "react";
import Reflux from "reflux";
import { GearStore, GearActions } from "./GearStore";
import GearForm from "./GearForm";
import GearTable from "./GearTable";
import Constants from "../../constants/constants";

export default class GearPage extends Reflux.Component {
    constructor() {
        super();

        this.store = GearStore;
    }

    componentDidMount() {
        if (!this.state.fetchedGearList) {
            GearActions.fetchGearList();
        }
    }

    wrapOpenModal(callback) {
        return () => callback(Constants.modals.CREATING);
    }

    render() {
        return (
            <div className="gear-view">
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-primary" onClick={this.wrapOpenModal(GearActions.openGearModal)}>
                            <i className="fas fa-plus-circle" /> Add New Gear
                        </button>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <GearTable gearList={this.state.gearList} onClickEdit={GearActions.openGearModal} />
                    </div>
                </div>
                <GearForm {...this.state.gearModal}
                    formTitle={"testTitle"}
                    onChange={GearActions.gearModalChanged}
                    onSubmit={GearActions.submitGearModal}
                    onClose={GearActions.closeGearModal}
                />
            </div>
        );
    }
};
