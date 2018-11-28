import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import PaymentForm from "react/reservation/payment/PaymentForm";
import { ReservationActions } from "react/reservation/ReservationStore";
import sinon from "sinon";

let actionsStub;
const sandbox = sinon.createSandbox(),
    getShallowForm = (props = {}) => {
        return shallow(
            <PaymentForm
                id={props.id}
                email={props.email}
                licenseName={props.licenseName}
                licenseAddress={props.licenseAddress}
                status={props.status}
                startDate={props.startDate}
                endDate={props.endDate}
                gear={props.gear}
            />
        );
    }, mockReservation = {
        id: 99,
        email: "email@email.com",
        licenseName: "Email",
        licenseAddress: "Email - EmailSt",
        status: "REQUESTED",
        startDate: "1970-01-01",
        endDate: "1970-01-08",
        gear: [{
            description: "deleted",
            code: "sp022",
            version: 1,
            depositFee: "1.00",
            category: "sleeping bag",
            condition: "DELETED",
            id: 4
        }]
    };

describe("PaymentForm Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(ReservationActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls fetchPayPalForm on mount", () => {
        const form = getShallowForm(mockReservation);
        actionsStub.fetchPayPalForm = sandbox.spy();

        form.instance().componentDidMount();
        expect(actionsStub.fetchPayPalForm.calledOnce).to.be.true;

        form.instance().state.fetchedPayPalForm = true;
        form.instance().componentDidMount();
        expect(actionsStub.fetchPayPalForm.calledOnce).to.be.true;
    });

    it("renders error message if error", () => {
        const form = getShallowForm(mockReservation);

        form.instance().state.error = "Error";
        expect(form.instance().getPayPalLink().props.children[0].props.children).to.equal("Error")
    });

    it("renders link if exists", () => {
        const form = getShallowForm(mockReservation);

        form.instance().state.payPalForm = "https://Somelink.com";
        expect(form.instance().getPayPalLink().props.href)
            .to.equal("https://Somelink.com")
    });
});
