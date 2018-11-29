import React from "react";
import Page from "react/accounts/AccountsPage";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";

const sandbox = sinon.createSandbox();

describe("AccountsPage Tests", () => {
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

    it("getErrorAlert - returns error", () => {
        const page = shallow(<Page />);

        expect(page.instance().getErrorAlert()).to.equal(undefined);
        expect(page.instance().getErrorAlert(true)).to.not.equal(null);
    });

    it("getPasswordMessage - returns message", () => {
        const page = shallow(<Page />);

        expect(page.instance().getPasswordMessage("")).to.equal(undefined);
        expect(page.instance().getPasswordMessage("changed")).to.not.equal(null);
    });

    it("getPasswordAlert - returns an error message", () => {
        const page = shallow(<Page />);

        expect(page.instance().getPasswordAlert()).to.equal(undefined);
        expect(page.instance().getPasswordAlert("error")).to.not.equal(null);
    });
});
