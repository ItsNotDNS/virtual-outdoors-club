
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { GearActions } from "react/gear/GearStore";
import sinon from "sinon";
import ReservationStatusSearchBar
    from "../../../../react/reservation/ReservationStatusSearchBar";
import {ReservationActions} from "../../../../react/reservation/ReservationStore";
import constants from "../../../../constants/constants";

const sandbox = sinon.createSandbox();
let actionsStub;
describe("ReservationStatusSearchBar Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(ReservationActions);
    });

    afterEach(() => {
        sandbox.restore();
    });



    it("calls onGearStatusCheckBoxChange when handleChange is called", () => {
        const event = {
                target: {
                    name: "REQUESTED",
                    checked: true
                }
            },
            { REQUESTED, APPROVED, PAID, TAKEN, RETURNED, CANCELLED } = constants.reservations.status,
            mockOptions = {
            [REQUESTED]: true,
            [APPROVED]: true,
            [PAID]: true,
            [TAKEN]: true,
            [RETURNED]: false,
            [CANCELLED]: false
        },
            mySpy = sinon.spy(),
            statusSearchBar = shallow(
                <ReservationStatusSearchBar
                    options={mockOptions}
                    changeValue={mySpy}
            />);

        statusSearchBar.instance().handleChange(event);
        expect(mySpy.calledOnce).to.be.true;
    });
});
