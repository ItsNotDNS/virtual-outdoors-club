import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import { GearActions } from "react/gear/GearStore";
import GearConditionDropdown from "../../../../react/gear/GearConditionDropdown";

const sandbox = sinon.createSandbox(),
    getShallowDropdown = (props = {}) => {
        return shallow(
            <GearConditionDropdown
                onChange={props.onChange}
                value={props.value}
            />
        );
    };
let actionsStub;

describe("GearCategoryDropdown Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(GearActions); // Must stub actions to prevent making network calls
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls updateConditionDropdown on handleChange", () => {
        const dropdown = getShallowDropdown();

        actionsStub.updateConditionDropdown = sinon.spy();

        dropdown.instance().handleChange({ target: { value: "socks" } });

        expect(actionsStub.updateConditionDropdown.calledWith("socks")).to.be.true;
    });

    it("calls onChange if provided in handleChange", () => {
        const onChangeSpy = sinon.spy(),
            event = { target: { value: "socks" } },
            dropdown = getShallowDropdown({
                onChange: onChangeSpy,
                value:"RENTABLE"
            });

        dropdown.instance().handleChange(event);

        expect(onChangeSpy.calledWith(event)).to.be.true;
    });

    it("return null if invalid entry", () => {
        const onChangeSpy = sinon.spy(),
            event = { target: { value: "socks" } },
            dropdown = getShallowDropdown({
                onChange: onChangeSpy,
                value:"some_invalid_value"
            });
        expect(dropdown.text()).to.equal("");
    });
});
