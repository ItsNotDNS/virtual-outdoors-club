import React from "react";
import ReservationPage from "react/reservation/ReservationPage";
import { ReservationActions } from "react/reservation/ReservationStore";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";
import moment from "moment";

const sandbox = sinon.createSandbox();
let actionsStub;

describe("ReservationPage Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(ReservationActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls fetchedReservationList on mount", () => {
        const page = shallow(<ReservationPage />);
        actionsStub.fetchReservationList = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.fetchReservationList.calledOnce).to.be.true;

    });

    it("creates a wrapper that passes CREATE to the callback", () => {
        const page = shallow(<ReservationPage />),
            cb = (value) => {
                expect(value).to.equal(Constants.modals.CREATING);
            };

        page.instance().wrapOpenModal(cb)();
    });

    it("handleFilterStartDateChange calls dateFilterChanged", () => {
        const page = shallow(<ReservationPage />),
            mockDate = moment("2013-03-01", "YYYY-MM-DD");
        actionsStub.dateFilterChanged = sandbox.spy();
        page.instance().handleFilterStartDateChange(mockDate);
        expect(actionsStub.dateFilterChanged.calledOnce).to.be.true;
    });

    it("handleFilterEndDateChange calls dateFilterChanged", () => {
        const page = shallow(<ReservationPage />),
            mockDate = moment("2013-03-01", "YYYY-MM-DD");
        actionsStub.dateFilterChanged = sandbox.spy();
        page.instance().handleFilterEndDateChange(mockDate);
        expect(actionsStub.dateFilterChanged.calledOnce).to.be.true;
    });

    it("componentDidUpdate success", () => {
        const page = shallow(<ReservationPage />),
            mockPrevProps = null,
            mockPrevState = {};
        actionsStub.fetchReservationListFromTo = sandbox.spy();
        page.instance().componentDidUpdate(mockPrevProps, mockPrevState);
        expect(actionsStub.fetchReservationListFromTo.calledOnce).to.be.false;
        page.instance().state.dateFilter.startDate = "2013-03-01";
        page.instance().componentDidUpdate(mockPrevProps, mockPrevState);
        expect(actionsStub.fetchReservationListFromTo.calledOnce).to.be.false;
        page.instance().state.dateFilter.endDate = "2013-03-03";
        page.instance().componentDidUpdate(mockPrevProps, mockPrevState);
        expect(actionsStub.fetchReservationListFromTo.calledOnce).to.be.true;
    });
});
