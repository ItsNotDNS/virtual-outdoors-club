import React from "react";
import GearPage from "react/gear/GearPage";
import { GearActions } from "react/gear/GearStore";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";

const sandbox = sinon.createSandbox();
let actionsStub;

describe("GearPage Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(GearActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls fetchedGearList on mount", () => {
        const page = shallow(<GearPage />);
        actionsStub.fetchGearList = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.fetchGearList.calledOnce).to.be.true;

        page.instance().state.fetchedGearList = true; // not set by the component

        page.instance().componentDidMount();

        expect(actionsStub.fetchGearList.calledOnce).to.be.true;
    });

    it("calls fetchGearCategoryList on mount", () => {
        const page = shallow(<GearPage />);
        actionsStub.fetchGearCategoryList = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.fetchGearCategoryList.calledOnce).to.be.true;

        page.instance().state.fetchedGearCategoryList = true; // not set by the component

        page.instance().componentDidMount();

        expect(actionsStub.fetchGearCategoryList.calledOnce).to.be.true;
    });

    it("creates a wrapper that passes CREATE to the callback", () => {
        const page = shallow(<GearPage />),
            cb = (value) => {
                expect(value).to.equal(Constants.modals.CREATING);
            };

        page.instance().wrapOpenModal(cb)();
    });
});
