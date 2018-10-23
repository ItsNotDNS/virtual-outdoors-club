/**
 * Home page for gear management. Contains the list of gear,
 * add gear button, and edit/delete gear actions
 */

import React from "react";
import Reflux from "reflux";
import { Tabs, Tab } from "react-bootstrap";
import { GearStore, GearActions } from "./GearStore";
import GearForm from "./GearForm";
import GearTable from "./GearTable";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import Constants from "../../constants/constants";
import ErrorAlert from "../components/ErrorAlert";

export default class GearPage extends Reflux.Component {
    constructor() {
        super();

        this.store = GearStore;
    }

    componentDidMount() {
        if (!this.state.fetchedGearList) {
            GearActions.fetchGearList();
        }
        if (!this.state.fetchedGearCategoryList) {
            GearActions.fetchGearCategoryList();
        }
    }

    wrapOpenModal(callback) {
        return () => callback(Constants.modals.CREATING);
    }

    render() {
        return (
            <div className="gear-view">
                <ErrorAlert show={!!this.state.error} errorMessage={this.state.error} />
                <Tabs defaultActiveKey={1} id="gear-view-tabs">
                    <Tab eventKey={1} title="Gear">
                        <div className="row">
                            <div className="col-md-12">
                                <button className="btn btn-primary" onClick={this.wrapOpenModal(GearActions.openGearModal)}>
                                    <i className="fas fa-plus-circle" /> Add New Gear
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <GearTable gearList={this.state.gearList} onClickEdit={GearActions.openGearModal} />
                            </div>
                        </div>
                        <GearForm {...this.state.gearModal}
                            formTitle={`${this.state.gearModal.mode} gear`}
                            onChange={GearActions.gearModalChanged}
                            onSubmit={GearActions.submitGearModal}
                            onClose={GearActions.closeGearModal}
                        />
                    </Tab>
                    <Tab eventKey={2} title="Categories">
                        <div className="row">
                            <div className="col-md-12">
                                <button className="btn btn-primary" onClick={this.wrapOpenModal(GearActions.openCategoryModal)}>
                                    <i className="fas fa-plus-circle" /> Add New Category
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <CategoryTable categories={this.state.categoryList} onClickEdit={GearActions.openCategoryModal} />
                            </div>
                        </div>
                        <CategoryForm {...this.state.categoryModal}
                            formTitle={`${this.state.categoryModal.mode} category`}
                            onChange={GearActions.categoryModalChanged}
                            onSubmit={GearActions.submitCategoryModal}
                            onClose={GearActions.closeCategoryModal}
                        />
                    </Tab>
                </Tabs>
            </div>
        );
    }
};
