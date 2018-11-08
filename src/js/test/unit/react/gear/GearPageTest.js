import React from "react";
import GearPage from "react/gear/GearPage";
import { GearActions } from "react/gear/GearStore";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
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

    it("displays error if upload.error set", () => {
        const page = mount(<GearPage />);

        page.setState({
            tabSelected: 3
        });
        expect(page.find(".alert-danger")).to.have.length(0);
        page.setState({
            upload: { error: "this is bad", warnings: [], gear: [] }
        });
        expect(page.find(".alert-danger")).to.have.length(1);
    });

    it("displays warning if upload.warnings set", () => {
        const page = mount(<GearPage />);

        page.setState({
            tabSelected: 3
        });
        expect(page.find(".alert-warning")).to.have.length(0);
        page.setState({
            upload: { error: "", warnings: ["row 532 has an issue"], gear: [] }
        });
        expect(page.find(".alert-warning")).to.have.length(1);
    });

    it("displays info if upload.gear set", () => {
        const page = mount(<GearPage />);

        page.setState({
            tabSelected: 3
        });
        expect(page.find(".alert-info")).to.have.length(0);
        page.setState({
            upload: { error: "", warnings: [], gear: [{}], results: { show: false, failed: [] } }
        });
        expect(page.find(".alert-info")).to.have.length(1);
    });

    it("displays success if upload.results.show set", () => {
        const page = mount(<GearPage />);

        page.setState({
            tabSelected: 3
        });
        expect(page.find(".alert-success")).to.have.length(0);
        page.setState({
            upload: { error: "", warnings: [], gear: [{}], results: { show: true, failed: [] } }
        });
        expect(page.find(".alert-success")).to.have.length(1);
    });
});
