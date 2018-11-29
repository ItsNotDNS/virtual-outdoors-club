import React from "react";
import { expect } from "chai";
import HelpPage from "react/help/HelpPage";
import constants from "../../../../constants/constants";
import sinon from "sinon";
import {shallow} from "enzyme";

describe("Help Page Tests", () => {
    it("gear page help renders correct information", () => {
        expect(HelpPage.getGearHelp().props.id).to.equal(constants.help.gear)
    });

    it("rent page help renders correct info - member", () => {
        const page = shallow(<HelpPage />);

        expect(page.instance().getRentHelp().props.id).to.equal("rent-page")

    });

    it("rent page help renders correct info - exec", () => {
        const page = shallow(<HelpPage />);

        page.instance().state.isAuthenticated = true;
        expect(page.instance().getRentHelp().props.id).to.equal("rent-page")

    });

    it("reservation page help renders correct information", () => {
        expect(HelpPage.getReservationHelp().props.id).to.equal(constants.help.reservation)
    });

    it("members page help renders correct information", () => {
        expect(HelpPage.getMembersHelp().props.id).to.equal(constants.help.members)
    });

    it("disable system page help renders correct information", () => {
        expect(HelpPage.getDisableSystemHelp().props.id).to.equal(constants.help.disableSystem)
    });

    it("statistics page help renders correct information", () => {
        expect(HelpPage.getStatisticsHelp().props.id).to.equal(constants.help.statistics)
    });

    it("system variables page help renders correct information", () => {
        expect(HelpPage.getSystemVariablesHelp().props.id).to.equal(constants.help.systemVariables)
    });

    it("change password page help renders correct information", () => {
        expect(HelpPage.getChangePasswordHelp().props.id).to.equal(constants.help.changePassword)
    });

    it("nav bar coverage", () => {
        HelpPage.getNav();
        expect(true).to.be.true;
    });
});
