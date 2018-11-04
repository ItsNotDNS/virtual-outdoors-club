import { ReservationStore } from "react/reservation/ReservationStore";
import sinon from "sinon";
import { expect } from "chai";
import axios from "axios";

let getStub, postStub, reservationStore = new ReservationStore();
const sandbox = sinon.createSandbox(),
    mockReservationList = [{
        "id": 1,
        "email": "barry@ualberta.ca",
        "licenseName": "Barry Bob",
        "licenseAddress": "1234 St",
        "startDate": "2018-10-20",
        "endDate": "2018-10-20",
        "status": "REQUESTED",
        "version": 1
    }],
    mockReservation = {
        id: 99,
        email: "email@email.com",
        licenseName: "Email",
        licenseAddress: "Email - EmailSt",
        status: "REQUESTED",
        startDate: "1970-01-01",
        endDate: "1970-01-08",
        gear: []
    },
    emptyReservation = {
        id: null,
        email: null,
        licenseName: null,
        licenseAddress: null,
        status: null,
        startDate: null,
        endDate: null,
        gear: []
    };

describe("ReservationStore Tests", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axios, "get");
        postStub = sandbox.stub(axios, "post");
    });

    afterEach(() => {
        sandbox.restore();
        reservationStore = new ReservationStore();
    });

    it("onFetchReservationList - success path", () => {
        const promise = Promise.resolve({ data: { data: mockReservationList } });

        expect(reservationStore.state.fetchedReservationList).to.be.false;

        getStub.returns(promise); // set stub to return mock data

        return reservationStore.onFetchReservationList().then(() => {
            expect(reservationStore.state.fetchedReservationList).to.be.true;
            expect(reservationStore.state.reservationList).to.deep.equal(mockReservationList);
            expect(reservationStore.state.error).to.equal(false);
        });
    });

    it("onFetchReservationList - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);

        expect(reservationStore.state.fetchedReservationList).to.be.false;

        getStub.returns(promise); // set stub to return mock data

        return reservationStore.onFetchReservationList().then(() => {
            expect(reservationStore.state.fetchedReservationList).to.be.true;
            expect(reservationStore.state.reservationList).to.deep.equal([]);
            expect(reservationStore.state.error).to.equal(error.response.data.message);
        });
    });

    it("onOpenEmailValidationForm sets the id", () => {
        expect(reservationStore.state.emailValidationForm.id).to.equal(null);

        reservationStore.onOpenEmailValidationForm(1);

        expect(reservationStore.state.emailValidationForm.id).to.equal(1);
    });

    it("emailValidationFormChanged - email", () => {
        expect(reservationStore.state.emailValidationForm.email).to.equal(null);

        reservationStore.onEmailValidationFormChanged("email", "email@email.com");

        expect(reservationStore.state.emailValidationForm.email).to.equal("email@email.com");
    });

    it("onFetchReservation - success path", () => {
        const promise = Promise.resolve({ data: mockReservation });

        expect(reservationStore.state.reservation).to.deep.equal(emptyReservation);

        getStub.returns(promise); // set stub to return mock data

        return reservationStore.onFetchReservation().then(() => {
            expect(reservationStore.state.reservation).to.deep.equal(mockReservation);
            expect(reservationStore.state.error).to.equal(false);
        });
    });

    it("onFetchReservation - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);

        getStub.returns(promise); // set stub to return mock data

        return reservationStore.onFetchReservation().then(() => {
            expect(reservationStore.state.reservation).to.deep.equal(emptyReservation);
            expect(reservationStore.state.emailValidationForm.errorMessage).to.equal(error.response.data.message);
        });
    });

    it("onFetchPayPalForm - success path", () => {
        const payPalForm = "Some html string",
            promise = Promise.resolve({ data: payPalForm });

        expect(reservationStore.state.payPalForm).to.equal(null);

        postStub.returns(promise); // set stub to return mock data

        return reservationStore.onFetchPayPalForm().then(() => {
            expect(reservationStore.state.payPalForm).to.equal(payPalForm);
            expect(reservationStore.state.error).to.equal(false);
        });
    });

    it("onFetchPayPalForm - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);

        postStub.returns(promise); // set stub to return mock data

        return reservationStore.onFetchPayPalForm().then(() => {
            expect(reservationStore.state.payPalForm).to.equal(null);
            expect(reservationStore.state.error).to.equal(error.response.data.message);
        });
    });
});
