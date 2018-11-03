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
import ConfirmationDialog from "../components/ConfirmationDialog";

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
                                <GearTable
                                    gearList={this.state.gearList}
                                    onClickEdit={GearActions.openGearModal}
                                    onClickDelete={
                                        GearActions.openDeleteGearModal
                                    }
                                    checkboxOptions={this.state.checkboxOptions}
                                />
                            </div>
                        </div>
                        <GearForm {...this.state.gearModal}
                            formTitle={`${this.state.gearModal.mode} Gear`}
                            onChange={GearActions.gearModalChanged}
                            onSubmit={GearActions.submitGearModal}
                            onClose={GearActions.closeGearModal}
                        />
                        <ConfirmationDialog
                            show={this.state.deleteGearModal.show}
                            title="Delete Gear"
                            message="Are you sure you want to delete this piece of gear?"
                            onClose={GearActions.closeDeleteGearModal}
                            onSubmit={GearActions.submitDeleteGearModal}
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
                                <CategoryTable
                                    categories={this.state.categoryList}
                                    onClickEdit={GearActions.openCategoryModal}
                                    onClickDelete={GearActions.openDeleteGearCategoryModal}
                                />
                            </div>
                        </div>
                        <CategoryForm {...this.state.categoryModal}
                            formTitle={`${this.state.categoryModal.mode} Category`}
                            onChange={GearActions.categoryModalChanged}
                            onSubmit={GearActions.submitCategoryModal}
                            onClose={GearActions.closeCategoryModal}
                        />
                        <ConfirmationDialog
                            show={this.state.deleteGearCategoryModal.show}
                            title="Delete Gear Category"
                            message="Are you sure you want to delete this gear category?"
                            onClose={GearActions.closeDeleteGearCategoryModal}
                            onSubmit={GearActions.submitDeleteGearCategoryModal}
                        />
                    </Tab>
                </Tabs>
            </div>
        );
    }
};
