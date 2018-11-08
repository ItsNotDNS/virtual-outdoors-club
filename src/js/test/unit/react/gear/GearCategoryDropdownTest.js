import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import GearCategoryDropdown from "react/gear/GearCategoryDropdown";
import { GearActions } from "react/gear/GearStore";

const sandbox = sinon.createSandbox(),
    getShallowDropdown = (props = {}) => {
        return shallow(
            <GearCategoryDropdown
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

    it("calls Actions.updateDropdown on handleChange", () => {
        const dropdown = getShallowDropdown();

        actionsStub.updateDropdown = sinon.spy();

        dropdown.instance().handleChange({ target: { value: "socks" } });

        expect(actionsStub.updateDropdown.calledWith("socks")).to.be.true;
    });

    it("calls onChange if provided in handleChange", () => {
        const onChangeSpy = sinon.spy(),
            event = { target: { value: "socks" } },
            dropdown = getShallowDropdown({
                onChange: onChangeSpy
            });

        dropdown.instance().handleChange(event);

        expect(onChangeSpy.calledWith(event)).to.be.true;
    });

    it("doesn't call fetchGearCategoryList if state.fetchedGearCategoryList is true", () => {
        const dropdown = getShallowDropdown();

        dropdown.instance().state.fetchedGearCategoryList = true;
        actionsStub.fetchGearCategoryList = sinon.spy();
        dropdown.instance().componentDidMount();

        expect(actionsStub.fetchGearCategoryList.calledWith()).to.be.false;
    });

    it("generates a list of <options> based on categoryList", () => {
        const dropdown = getShallowDropdown(),
            list = [{ name: "book" }, { name: "backpack" }, { name: "sleeping bag" }];
        dropdown.instance().state.categoryList = list;

        dropdown.instance().dropdownOptions.forEach((option, i) => {
            expect(option.props.children).to.equal(list[i].name);
        });
    });
});
