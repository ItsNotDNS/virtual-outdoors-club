/**
 * Home page for gear management. Contains the list of gear,
 * add gear button, and edit/delete gear actions
 */

import React from "react";
import Reflux from "reflux";
import { Tabs, Tab, Alert } from "react-bootstrap";
import { GearStore, GearActions } from "./GearStore";
import GearForm from "./GearForm";
import GearTable from "./GearTable";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import Constants from "../../constants/constants";
import ErrorAlert from "../components/ErrorAlert";
import ConfirmationDialog from "../components/ConfirmationDialog";
import FileButton from "../components/FileButton";
import FlaggedGearTable from "./FlaggedGearTable";

export default class GearPage extends Reflux.Component {
    constructor() {
        super();

        this.store = GearStore;

        this.getGearTab = this.getGearTab.bind(this);
        this.getCategoryTab = this.getCategoryTab.bind(this);
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

    getGearTab(tabKey) {
        return (
            <Tab eventKey={tabKey} title="Gear">
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-primary span" onClick={this.wrapOpenModal(GearActions.openGearModal)}>
                            <i className="fas fa-plus-circle" /> Add New Gear
                        </button>
                        <button
                            onClick={GearActions.getGearFile}
                            className="btn btn-primary pull-right"
                        >
                            <i className="fas fa-file-import" /> Export Gear Data
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <GearTable
                            gearList={this.state.gearList}
                            onClickEdit={GearActions.openGearModal}
                            onClickDelete={GearActions.openDeleteGearModal}
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
        );
    }

    getCategoryTab(tabKey) {
        return (
            <Tab eventKey={tabKey}
                title="Categories">
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
        );
    }

    getFlaggedGearTab(tabKey) {
        return (
            <Tab eventKey={tabKey} title="Flagged Gear">
                <div className="row">
                    <div className="col-md-12">
                        <FlaggedGearTable
                            gearList={this.state.gearList}
                            onClick={GearActions.openGearModal}
                        />
                    </div>
                </div>
            </Tab>
        );
    }

    getUploadErrorAlert(error) {
        if (error) {
            return (
                <Alert bsStyle="danger">
                    <h4>You cannot upload this file.</h4>
                    <p>{error}</p>
                </Alert>
            );
        }
    }

    getUploadWarningAlert(warnings) {
        if (warnings.length > 0) {
            const children = warnings.map((w, i) => <li key={i}>{w}</li>);
            return (
                <Alert bsStyle="warning">
                    <h4>The file you are uploading has some inconsistencies.</h4>
                    <p><strong>You cannot upload this file.</strong></p>
                    <p>You may want to check out the following rows:</p>
                    <ul>{children}</ul>
                </Alert>
            );
        }
    }

    getParseSuccessAlert(gear) {
        if (gear.length) {
            return (
                <Alert bsStyle="info">
                    <h4>Looking Good!</h4>
                    <p>Clicking upload will attempt to merge the {gear.length} items into the inventory.</p>
                    <p>Note: If the gear already exists, it will not be merged.</p>
                </Alert>
            );
        }
    }

    getUploadSuccessAlert(result) {
        const numFailed = result.failed.length,
            errorsExistMsg = `Could not upload ${numFailed} rows, potentially because they were already in the system.`,
            successMessage = "All rows were uploaded!";

        if (result.show) {
            return (
                <Alert bsStyle="success">
                    <h4>File Uploaded</h4>
                    <p>{numFailed ? errorsExistMsg : successMessage}</p>
                </Alert>
            );
        }
    }

    getImportExportTab(tabKey) {
        const { gear, warnings, error, results } = this.state.upload,
            alert = this.getUploadErrorAlert(error) ||
                this.getUploadWarningAlert(warnings) ||
                this.getUploadSuccessAlert(results) ||
                this.getParseSuccessAlert(gear);

        return (
            <Tab eventKey={tabKey}
                title={"Import"}
            >
                {alert}
                <FileButton
                    onFileSelected={GearActions.fileSelected}
                    placeholder="Choose a file to upload gear to the system." />
                <div className="text-center">
                    <button
                        onClick={GearActions.uploadGearFile}
                        disabled={gear.length === 0 || warnings.length !== 0}
                        className="btn btn-success submit-button"
                    >
                            Upload
                    </button>
                </div>
            </Tab>
        );
    }

    render() {
        return (
            <div className="gear-view">
                <ErrorAlert show={!!this.state.error} errorMessage={this.state.error} />
                <Tabs id="gear-view-tabs"
                    activeKey={this.state.tabSelected}
                    onSelect={GearActions.tabSelected}
                >
                    {this.getGearTab(1)}
                    {this.getCategoryTab(2)}
                    {this.getFlaggedGearTab(3)}
                    {this.getImportExportTab(4)}
                </Tabs>
            </div>
        );
    }
};
