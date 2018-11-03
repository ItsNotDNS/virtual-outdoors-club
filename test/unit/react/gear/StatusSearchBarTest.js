
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import StatusSearchBar from "react/gear/StatusSearchBar";
import { GearActions } from "react/gear/GearStore";
import sinon from "sinon";

const sandbox = sinon.createSandbox();
let actionsStub;
describe("StatusSearchBar Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(GearActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls onGearStatusCheckBoxChange when handleChange is called", () => {
        const event = {
                target: {
                    name: "RENTABLE",
                    checked: true
                }
            },
            statusSearchBar = shallow(<StatusSearchBar />);

        statusSearchBar.instance().handleChange(event);
        expect(actionsStub.gearStatusCheckBoxChange.calledOnce).to.be.true;
    });
});
