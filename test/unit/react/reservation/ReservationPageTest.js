import React from "react";
import ReservationPage from "react/reservation/ReservationPage";
import { ReservationActions } from "react/reservation/ReservationStore";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";


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

        page.instance().state.fetchedReservationList = true; // not set by the component

        page.instance().componentDidMount();

        expect(actionsStub.fetchReservationList.calledOnce).to.be.true;
    });

    it("creates a wrapper that passes CREATE to the callback", () => {
        const page = mount(<ReservationPage />),
            cb = (value) => {
                expect(value).to.equal(Constants.modals.CREATING);
            };

        page.instance().render();
    });
});
