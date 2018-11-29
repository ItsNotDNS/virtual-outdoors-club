import React from "react";
import Reflux from "reflux";
import { Image, Nav, NavItem } from "react-bootstrap";
import constants from "../../constants/constants";
import { LoginStore } from "../login/LoginStore";

function importAll(r) {
    const images = {};
    r.keys().map((item, index) => { images[item.replace("./", "")] = r(item); });
    return images;
}

const images = importAll(require.context("../../../images", true, /\.(png)$/));

export default class HelpPage extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = LoginStore;

        this.getRentHelp = this.getRentHelp.bind(this);
        this.getPages = this.getPages.bind(this);
    }

    static getGearHelp() {
        return (
            <div id={constants.help.gear}>
                <h1> Gear Page </h1>
                <div className="row">
                    <div className="col-md-6">
                    Whether you are left with a blank database of gear or intend on uploading a huge group of new
                    rentals, you will be able to upload an Excel (.xlsx) file that will allow you to upload gear
                    in a few clicks. Here is an example of what the Excel file should look like.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["ExcelExample.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                    Simply <strong>Choose File </strong>-> <strong>Select .xlsx file </strong>-> <strong> Upload</strong>.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["GearImport.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                    In case of any issues, it will display information such as
                    errors in the upload, or the amount of duplicate gear being ignored
                    after attempting to upload.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["GearImportXLSX.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                    As you navigate to the gear page through the navigation bar, you will be able to see the
                    set of gear that you would have uploaded.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["GearPage.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        From here you will also be able to edit the gear using the actions in the table. The edit action also allows you
                        to view the gear history ie. if the deposit fee has changed.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["EditGearForm.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        All history pages are ordered from newest to oldest and only shows the last 10 changes.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["GearReservationHistoryTable.png"]} />
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    getRentHelp() {
        return (
            <div id={constants.help.rent}>
                <h1> Rent Page </h1>
                <div className="row">
                    <div className="col-md-6">
                        The rent page is where you will be able to request a reservation. You add items to the shopping cart using
                        the button at the end of the column with a cross symbol. You can filter the gear listed in the table using
                        the date range inputs, text search, and column ordering.
                    </div>
                    <div className="col-md-6">
                        {
                            this.state.isAuthenticated
                                ? <Image responsive
                                    src={images["ExecutiveRent.png"]} />
                                : <Image responsive
                                    src={images["MemberRent.png"]} />
                        }
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        After items are in the shopping cart the <strong>Checkout</strong> button will be enabled. Clicking on the
                        button will open a form to input other details needed to create a reservation.
                    </div>
                    <div className="col-md-6">
                        {
                            this.state.isAuthenticated
                                ? <Image responsive
                                    src={images["ExecutiveReservationForm.png"]} />
                                : <Image responsive
                                    src={images["MemberReservationForm.png"]} />
                        }
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    static getReservationHelp() {
        return (
            <div id={constants.help.reservation}>
                <h1> Reservation Page </h1>
                <div className="row">
                    <div className="col-md-6">
                        The reservation page is where you will be able to see all the reservations in the system. Reservations with a
                        status of "Returned" or "Cancelled" will not show up by default. The reservation list is filterable through a
                        date range, text search, and through checkboxes that map to the different reservation statuses. The table can
                        also be ordered by its columns.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["ReservationTable.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        Clicking on a row of the table will open a modal that gives detailed information about the reservation. Reservation
                        statuses go from <strong>requested</strong> to <strong>approved</strong> to <strong>paid</strong> to <strong>taken </strong>
                        to <strong>returned</strong>. A reservation can be cancelled as long as the status of the reservation is not already paid.
                        You will be able to edit the reservation as long as the status is not already taken.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["ReservationModal.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        The reservation modal will change depending on the status of the reservation
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["ReservationModalTAKEN.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        There is also a tab where you can view the reservation history. Any change that has happened to the reservation will
                        appear here.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["ReservationHistory.png"]} />
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    static getMembersHelp() {
        return (
            <div id={constants.help.members}>
                <h1> Members Page </h1>
                <div className="row">
                    <div className="col-md-6">
                        The members page is where you will be able to view all the members currently registered in the system, you are able
                        to filter the list with the search box provided. Only members will be able request a reservation. Here is an example
                        of the .xlsx file.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["MembersExcel.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        The upload tab allows you to upload a new member list. Emails that are part of the .xlsx that are blacklisted will not
                        be removed from the blacklist and remain blacklisted. Any email that is not in that .xlsx file will not be added as a
                        member to the system. Simply <strong>Choose File </strong>-> <strong>Select .xlsx file </strong>-> <strong> Upload</strong>.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["MemberUpload.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        To blacklist a member click on the <strong>Add to Blacklist</strong> button associated with an email.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["MemberTable.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        The blackist tab shows all emails that are currently blacklisted and can not request a gear reservation. The blacklist
                        is filterable through the search box provided. To unblacklist a member, click on the
                        associated <strong>Remove from Blacklist</strong> button
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["BlacklistTable.png"]} />
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    static getDisableSystemHelp() {
        return (
            <div id={constants.help.disableSystem}>
                <h1> Disable System Page </h1>
                <div className="row">
                    <div className="col-md-6">
                        This page allows you to disable the system and provides the option to cancel <strong>requested</strong>,
                        <strong> approved</strong>, and <strong>paid</strong> reservations. <strong>Note:</strong> paid reservations
                        can only be cancelled if it can be refunded. Otherwise it will not be cancelled.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["DisableSystem.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        There will be a checkbox when disabling the system that will provide the option of cancelling
                        reservations <strong>and</strong> preventing future reservations.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["DisableSystemForm.png"]} />
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    static getStatisticsHelp() {
        return (
            <div id={constants.help.statistics}>
                <h1> Statistics Page </h1>
                <div className="row">
                    <div className="col-md-6">
                        The statistics page provides simple statistics about the system. The gear tab provides information of which
                        gear is reserved the most.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["GearStatistics.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        The gear categories tab provides information of which gear category is the most popular.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["GearCategoryStatistics.png"]} />
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    static getSystemVariablesHelp() {
        return (
            <div id={constants.help.systemVariables}>
                <h1> System Variables Page </h1>
                <div className="row">
                    <div className="col-md-6">
                        The system variables page allows you to modify variables associated with members and with executives. From here
                        you will be able to set certain variables that relate to reservations created by both members and executuves.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["MemberSystemVariables.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        Executives have their own tab because they have different system variables associated with them
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["ExecutiveSystemVariables.png"]} />
                    </div>
                </div>
                <hr />
            </div>
        );
    };

    static getChangePasswordHelp() {
        return (
            <div id={constants.help.changePassword}>
                <h1> Change Password Page </h1>
                <div className="row">
                    <div className="col-md-6">
                        The change password page allows you to change the passwords of the admin and executive accounts. When changing
                        the admin account you need to provide the old password, a new password, and confirmation of the new password.
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["AdminChangePassword.png"]} />
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-6">
                        When changing the executive password, you do not need the old password. It is sufficient to provide a new password
                        and the confirmation of the new password
                    </div>
                    <div className="col-md-6">
                        <Image responsive src={images["ExecutiveChangePassword.png"]} />
                    </div>
                </div>
            </div>
        );
    };

    static getNav() {
        return (
            <Nav bsStyle="pills" stacked className="nav-help">
                <NavItem eventKey={1} href={`#${constants.help.introduction}`}>
                        Introduction
                </NavItem>
                <NavItem eventKey={2} href={`#${constants.help.gear}`}>
                        Gear Page
                </NavItem>
                <NavItem eventKey={2} href={`#${constants.help.rent}`}>
                        Rent Page
                </NavItem>
                <NavItem eventKey={2} href={`#${constants.help.reservation}`}>
                        Reservation Page
                </NavItem>
                <NavItem eventKey={2} href={`#${constants.help.members}`}>
                        Members Page
                </NavItem>
                <NavItem eventKey={2} href={`#${constants.help.disableSystem}`}>
                        Disable System Page
                </NavItem>
                <NavItem eventKey={2} href={`#${constants.help.statistics}`}>
                        Statistics Page
                </NavItem>
                <NavItem eventKey={2} href={`#${constants.help.systemVariables}`}>
                        System Variables Page
                </NavItem>
                <NavItem eventKey={2} href={`#${constants.help.changePassword}`}>
                        Change Password Page
                </NavItem>
            </Nav>
        );
    }

    getPages() {
        if (this.state.isAuthenticated) {
            return (
                <div className="content-container col-md-6">
                    <h1 id={constants.help.introduction}> Introduction </h1>
                    <p>
                        This is the University of Alberta Outdoors Club
                        management system. Admins and Executives
                        will be able to manage gear, reservations, and payments,
                        as well as keep track of the rentals
                        and members in the club throughout the year. This page
                        will help you learn the key
                        functionalities of the system.
                    </p>
                    {HelpPage.getGearHelp()}
                    {this.getRentHelp()}
                    {HelpPage.getReservationHelp()}
                    {HelpPage.getMembersHelp()}
                    {HelpPage.getDisableSystemHelp()}
                    {HelpPage.getStatisticsHelp()}
                    {HelpPage.getSystemVariablesHelp()}
                    {HelpPage.getChangePasswordHelp()}
                </div>
            );
        } else {
            return (
                <div>
                    {this.getRentHelp()}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="help-page">
                <div className="row flex">
                    <div className="col-sm-offset-1 col-md-2">
                        {this.state.isAuthenticated ? HelpPage.getNav() : null}
                    </div>
                    {this.getPages()}
                    <div className="col-md-1" />
                </div>
            </div>
        );
    }
}
