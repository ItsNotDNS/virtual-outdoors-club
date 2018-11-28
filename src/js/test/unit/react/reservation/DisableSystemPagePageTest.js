import React from "react";
import DisableSystemPage from "react/reservation/DisableSystemPage";
import { ReservationActions } from "react/reservation/ReservationStore";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";
import moment from "moment";

const sandbox = sinon.createSandbox();
let actionsStub;

describe("DisableSystemPage Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(ReservationActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls fetchSystemStatus on mount", () => {
        const page = shallow(<DisableSystemPage />);
        actionsStub.fetchSystemStatus = sandbox.spy();
        page.instance().componentDidMount();
        expect(actionsStub.fetchSystemStatus.calledOnce).to.be.true;
    });

    it("calls cancelFutureReservationsChange in handleCheckboxChange", () => {
        const page = shallow(<DisableSystemPage />);
        actionsStub.cancelFutureReservationsChange = sandbox.spy();
        page.instance().handleCheckboxChange();
        expect(actionsStub.cancelFutureReservationsChange.calledOnce).to.be.true;
    });

    it("getButton return button that says says Enable Rental system when disableRent is true", () => {
        const page = shallow(<DisableSystemPage />);
        page.instance().state.disableSystem.disableRent = true;
        console.log(page.instance().getButton());
        expect(page.instance().getButton().props.children).to.equal("Enable Rental System");
    });

    it("getButton return button that says says Disable Rental system when disableRent is false", () => {
        const page = shallow(<DisableSystemPage />);
        page.instance().state.disableSystem.disableRent = false;
        console.log(page.instance().getButton());
        expect(page.instance().getButton().props.children).to.equal("Disable Rental System");
    });
});
