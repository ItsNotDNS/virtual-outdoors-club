import React from "react";
import ReservationForm from "react/reservation/ReservationForm";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import moment from "moment";
import { ReservationActions } from "react/reservation/ReservationStore";

let actionsStub;
const sandbox = sinon.createSandbox(), getShallowForm = (props = {}) => {
    const emptyFunc = () => {
    };

    return shallow(
        <ReservationForm
            onClose={props.close || emptyFunc}
            onChange={props.onChange || emptyFunc}
            onSubmit={props.onSubmit || emptyFunc}
            onApproveReservation={props.onApproveReservation || emptyFunc}
            formTitle={props.formTitle || "Some Title"}
            show={props.show || false}
            reservationID={props.reservationID}
            email={props.email}
            address={props.address}
            startDate={props.startDate}
            endDate={props.endDate}
            status={props.status}
        />
    );
};

describe("ReservationForm Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(ReservationActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls onChange when handleChange is called", () => {
        const onChangeSpy = sinon.spy(),
            event = {
                target: {
                    name: "name",
                    value: "value"
                }
            },
            form = getShallowForm({ onChange: onChangeSpy });

        form.instance().handleChange(event);

        expect(onChangeSpy.calledWith(event.target.name, event.target.value));
    });

    it("handleStartDateChange calls reservationModalChanged", () => {
        const page = shallow(<ReservationForm />),
            mockDate = moment("2013-03-01", "YYYY-MM-DD");
        actionsStub.reservationModalChanged = sandbox.spy();
        page.instance().handleStartDateChange(mockDate);
        expect(actionsStub.reservationModalChanged.calledOnce).to.be.true;
    });

    it("handleEndDateChange calls reservationModalChanged", () => {
        const page = shallow(<ReservationForm />),
            mockDate = moment("2013-03-01", "YYYY-MM-DD");
        actionsStub.reservationModalChanged = sandbox.spy();
        page.instance().handleEndDateChange(mockDate);
        expect(actionsStub.reservationModalChanged.calledOnce).to.be.true;
    });
});
