import React from "react";
import Page from "react/variability/EditVariabilityPage";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";

const sandbox = sinon.createSandbox();

describe("VariabilityPage Tests", () => {
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
});
