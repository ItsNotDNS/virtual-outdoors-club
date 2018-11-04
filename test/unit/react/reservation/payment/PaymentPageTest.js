import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import { ReservationActions } from "react/reservation/ReservationStore";
import PaymentPage from "react/reservation/payment/PaymentPage";

const sandbox = sinon.createSandbox();
let actionsStub;

describe("PaymentForm Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(ReservationActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls openEmailValidationForm on mount", () => {
        const page = shallow(<PaymentPage location={{ search: "?id=1" }} />);
        actionsStub.openEmailValidationForm = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.openEmailValidationForm.calledOnce).to.be.true;
    });

    it("renders PaymentForm when has reservation", () => {
        const page = shallow(<PaymentPage location={{ search: "?id=1" }} />);
        expect(page.instance().getComponent().type.name).to.equal("EmailValidationForm");
        page.instance().state.reservation = { id: 1 };
        page.instance().getComponent();
        expect(page.instance().getComponent().type.name).to.equal("PaymentForm");
    });

    it("renders EmailValidationForm when no reservation", () => {
        const page = shallow(<PaymentPage location={{ search: "?id=1" }} />);
        expect(page.instance().getComponent().type.name).to.equal("EmailValidationForm");
    });
});
