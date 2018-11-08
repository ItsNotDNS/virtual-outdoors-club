import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import ReservationStatusDropdown from "react/reservation/ReservationStatusDropdown";
import { ReservationActions } from "react/reservation/ReservationStore";

const sandbox = sinon.createSandbox(),
    getShallowDropdown = (props = {}) => {
        return shallow(
            <ReservationStatusDropdown
                onChange={props.onChange}
                value={props.value}
            />
        );
    };
let actionsStub;

describe("ReservationStatusDropdown Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(ReservationActions); // Must stub actions to prevent making network calls
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

    it("doesn't call fetchReservationList if state.fetchedReservationList is true", () => {
        const dropdown = getShallowDropdown();

        dropdown.instance().state.fetchedReservationList = true;
        actionsStub.fetchReservationList = sinon.spy();
        dropdown.instance().componentDidMount();

        expect(actionsStub.fetchReservationList.calledWith()).to.be.false;
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
});
