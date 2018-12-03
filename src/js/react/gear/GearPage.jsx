/**
 * Home page for gear management. Contains the list of gear,
 * add gear button, and edit/delete gear actions
 */

import React from "react";
import Reflux from "reflux";
import { Tabs, Tab, Alert } from "react-bootstrap";
import { GearStore, GearActions } from "./GearStore";
import GearModal from "./GearModal";
import GearTable from "./GearTable";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import Constants from "../../constants/constants";
import ErrorAlert from "../components/ErrorAlert";
import ConfirmationDialog from "../components/ConfirmationDialog";
import FileButton from "../components/FileButton";

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
                        <button
                            onClick={GearActions.getGearFile}
                            className="btn btn-primary pull-right export-button"
                        >
                            <i className="fas fa-file-import" /> Export
                        </button>
                        <button className="btn btn-primary pull-right add-new-button" onClick={this.wrapOpenModal(GearActions.openGearModal)}>
                            <i className="fas fa-plus-circle" /> Add New
                        </button>
                        <GearTable
                            gearList={this.state.gearList}
                            onSelectRow={GearActions.openGearHistoryModal}
                            onClickEdit={GearActions.openGearModal}
                            onClickDelete={GearActions.openDeleteGearModal}
                            checkboxOptions={this.state.checkboxOptions}
                        />
                    </div>
                </div>
                <GearModal {...this.state.gearModal}
                    formTitle={`${this.state.gearModal.mode} Gear`}
                    onChange={GearActions.gearModalChanged}
                    onSubmit={GearActions.submitGearModal}
                    onClose={GearActions.closeGearModal}
                    onTabSelected={GearActions.gearModalTabSelected}
                />
                <ConfirmationDialog
                    show={this.state.deleteGearModal.show}
                    title="Delete Gear"
                    message="Are you sure you want to delete this piece of gear?"
                    onClose={GearActions.closeDeleteGearModal}
                    onSubmit={GearActions.submitDeleteGearModal}
                    error={this.state.deleteGearModal.error}
                    errorMessage={this.state.deleteGearModal.errorMessage}
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
                        <button className="btn btn-primary pull-right" onClick={this.wrapOpenModal(GearActions.openCategoryModal)}>
                            <i className="fas fa-plus-circle" /> Add New
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
                    error={this.state.deleteGearCategoryModal.error}
                    errorMessage={this.state.deleteGearCategoryModal.errorMessage}
                />
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
        const warningKeys = Object.keys(warnings);
        if (warningKeys.length > 0) {
            const children = warningKeys.map((wk, i) => <li key={i}>{warnings[wk]}</li>);
            return (
                <Alert bsStyle="warning">
                    <h4>You are missing some optional data!</h4>
                    <p><strong>You can still upload this file.</strong></p>
                    <p>You may want to check out the following rows, but a default value will be added if you choose to submit anyway:</p>
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
                this.getUploadSuccessAlert(results) ||
                this.getUploadWarningAlert(warnings) ||
                this.getParseSuccessAlert(gear);

        return (
            <Tab eventKey={tabKey}
                title={"Import"}
            >
                {alert}
                <div className="row bottom-margin">
                    <div className="col-md-6 col-xs-12">
                        <FileButton
                            onFileSelected={GearActions.fileSelected}
                            placeholder="Choose a file to upload gear into the system."
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 col-xs-4">
                        <button className="btn btn-success full-width"
                            onClick={GearActions.uploadGearFile}
                            disabled={gear.length === 0}
                        >
                                Upload
                        </button>
                    </div>
                </div>
            </Tab>
        );
    }

    render() {
        return (
            <div className="gear-view">
                <ErrorAlert show={this.state.error} errorMessage={this.state.errorMessage} />
                <Tabs id="gear-view-tabs"
                    activeKey={this.state.tabSelected}
                    onSelect={GearActions.tabSelected}
                >
                    {this.getGearTab(1)}
                    {this.getCategoryTab(2)}
                    {this.getImportExportTab(3)}
                </Tabs>
            </div>
        );
    }
};
