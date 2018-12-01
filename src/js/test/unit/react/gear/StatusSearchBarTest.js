
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import StatusSearchBar from "react/gear/StatusSearchBar";
import { GearActions } from "react/gear/GearStore";
import sinon from "sinon";
import PropTypes from "prop-types";

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
            mockOptions = {
            RENTABLE: true,
            FLAGGED: true,
            NEEDS_REPAIR: true,
            DELETED: false
        },
            mySpy = sinon.spy(),
            statusSearchBar = shallow(
                <StatusSearchBar
                    options={mockOptions}
                    changeValue={mySpy}
                />
            );

        statusSearchBar.instance().handleChange(event);
        expect(mySpy.calledOnce).to.be.true;
    });
});
