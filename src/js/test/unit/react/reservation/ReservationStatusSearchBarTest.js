
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { GearActions } from "react/gear/GearStore";
import sinon from "sinon";
import ReservationStatusSearchBar
    from "../../../../react/reservation/ReservationStatusSearchBar";
import {ReservationActions} from "../../../../react/reservation/ReservationStore";

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
            statusSearchBar = shallow(<ReservationStatusSearchBar />);

        statusSearchBar.instance().handleChange(event);
        expect(actionsStub.reservationStatusCheckBoxChange.calledOnce).to.be.true;
    });
});
