import React from "react";
import Page from "react/variability/EditVariabilityPage";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import {VariableActions} from "../../../../react/variability/VariabilityStore";

const sandbox = sinon.createSandbox();
let actionsStub;
describe("VariabilityPage Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(VariableActions);
    });
    afterEach(() => {
        sandbox.restore();
    });

    it("handleChangeWrapper - properly wraps a callback", () => {
        const page = shallow(<Page />),
            spy = sinon.spy(),
            wrappedSpy = page.instance().handleChangeWrapper(spy),
            name = "testName",
            value = "testValue";

        expect(spy.calledOnce).to.be.false;
        wrappedSpy({ target: { name, value } });
        expect(spy.calledOnce).to.be.true;
        expect(spy.calledWith({ name, value })).to.be.true;
    });

    it("calls fetchSystemVariables on mount", () => {
        const page = shallow(<Page />);
        actionsStub.fetchSystemVariables = sandbox.spy();
        page.instance().componentDidMount();
        expect(actionsStub.fetchSystemVariables.calledOnce).to.be.true;

        page.instance().state.fetchedSystemVariables = true;
        page.instance().componentDidMount();
        expect(actionsStub.fetchSystemVariables.calledOnce).to.be.true
    });

    it("calls onSaveExecSystemVariables on click save exec", () => {
        const page = shallow(<Page />);
        actionsStub.saveExecSystemVariables = sandbox.spy();
        page.instance().onClickExecSaveButton();
        expect(actionsStub.saveExecSystemVariables.calledOnce).to.be.true;
    });

    it("calls onSaveMemberSystemVariables on click save exec", () => {
        const page = shallow(<Page />);
        actionsStub.saveMemberSystemVariables = sandbox.spy();
        page.instance().onClickMemberSaveButton();
        expect(actionsStub.saveMemberSystemVariables.calledOnce).to.be.true;
    });
});
