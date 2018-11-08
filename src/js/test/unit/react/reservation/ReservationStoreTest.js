import { ReservationStore } from "react/reservation/ReservationStore";
import sinon from "sinon";
import { expect } from "chai";
import axios from "axios";
import Constants from "constants/constants";
import config from "../../../../../config/config";

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
            expect(reservationStore.state.error).to.equal("");
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

    it("onOpenReservationModal, opens and closes modal", () => {
        expect(reservationStore.state.reservationModal.show).to.be.false;

        reservationStore.onOpenReservationModal();

        expect(reservationStore.state.reservationModal.show).to.be.true;

        reservationStore.onCloseReservationModal();

        expect(reservationStore.state.reservationModal.show).to.be.false;
    });

    it("onUpdateDropdown", () => {
        expect(reservationStore.state.statusDropdown.statusSelected).to.equal("");
        const testStatus = mockReservationList[0].status;
        reservationStore.onUpdateDropdown(testStatus);
        expect(reservationStore.state.statusDropdown.statusSelected).to.equal(testStatus);
    });

    it("onApproveReservation - Success Path", () => {
        const mockReservation = mockReservationList[0],
            mockReservationResponse = JSON.parse(JSON.stringify(mockReservation));
        mockReservationResponse.status = "APPROVED";
        reservationStore.state.reservationList = mockReservationList;

        reservationStore.onOpenReservationModal(Constants.modals.CREATING, {
            reservation: {
                id: mockReservation.id,
                email: mockReservation.email,
                licenseName: mockReservation.licenseName,
                licenseAddress: mockReservation.licenseAddress,
                startDate: mockReservation.startDate,
                endDate: mockReservation.endDate,
                status: mockReservation.status,
                version: mockReservation.version
            }
        });

        expect(reservationStore.state.reservationModal.id).to.equal(mockReservationResponse.id);
        expect(reservationStore.state.reservationModal.status).to.not.equal(mockReservationResponse.status);

        postStub.returns(Promise.resolve({ data: mockReservationResponse }));

        return reservationStore.onApproveReservation().then(() => {
            expect(reservationStore.state.reservationModal.status).to.equal(mockReservationResponse.status);
        });
    });

    it("onApproveReservation - Error Path", () => {
        const mockReservation = mockReservationList[0],
            mockReservationResponse = JSON.parse(JSON.stringify(mockReservation)),
            error = { response: { data: { message: "this is an error message" } } };

        mockReservationResponse.status = "APPROVED";
        reservationStore.state.reservationList = mockReservationList;

        reservationStore.onOpenReservationModal(Constants.modals.CREATING, {
            reservation: {
                id: mockReservation.id,
                email: mockReservation.email,
                licenseName: mockReservation.licenseName,
                licenseAddress: mockReservation.licenseAddress,
                startDate: mockReservation.startDate,
                endDate: mockReservation.endDate,
                status: mockReservation.status,
                version: mockReservation.version
            }
        });

        expect(reservationStore.state.reservationModal.id).to.equal(mockReservationResponse.id);
        expect(reservationStore.state.reservationModal.status).to.not.equal(mockReservationResponse.status);

        postStub.returns(Promise.reject(error));

        return reservationStore.onApproveReservation().then(() => {
            expect(reservationStore.state.reservationModal.status).to.not.equal(mockReservationResponse.status);
        });
    });

    it("onOpenCancelReservationModal, onCloseCancelReservationModal", () => {
        expect(reservationStore.state.cancelReservationModal.show).to.be.false;
        reservationStore.onOpenCancelReservationModal(mockReservationList[0].id);
        expect(reservationStore.state.cancelReservationModal.show).to.be.true;
        expect(reservationStore.state.cancelReservationModal.id).to.equal(mockReservationList[0].id);
        reservationStore.onCloseCancelReservationModal();
        expect(reservationStore.state.cancelReservationModal.show).to.be.false;
    });

    it("onSubmitCancelReservationModal - Success", () => {
        let expectedReservationList = mockReservationList;
        expectedReservationList[0].status = "CANCELLED";
        expectedReservationList = JSON.parse(JSON.stringify(expectedReservationList));

        reservationStore.state.reservationList = mockReservationList;
        reservationStore.state.cancelReservationModal.id = mockReservationList[0].id;
        postStub.returns(Promise.resolve({ data: "Success" }));

        return reservationStore.onSubmitCancelReservationModal().then(() => {
            expect(postStub.calledWith(`${config.databaseHost}/reservation/cancel`, {
                id: mockReservationList[0].id
            })).to.be.true;
        });
    });

    it("onSubmitCancelReservationModal - error", () => {
        const error = { response: { data: { message: "this is an error message" } } };
        let expectedReservationList = mockReservationList;
        expectedReservationList[0].status = "CANCELLED";
        expectedReservationList = JSON.parse(JSON.stringify(expectedReservationList));

        reservationStore.state.reservationList = mockReservationList;
        reservationStore.state.cancelReservationModal.id = mockReservationList[0].id;
        postStub.returns(Promise.reject(error));

        return reservationStore.onSubmitCancelReservationModal().then(() => {
            expect(postStub.calledWith(`${config.databaseHost}/reservation/cancel`, {
                id: mockReservationList[0].id
            })).to.be.true;
            expect(reservationStore.state.cancelReservationModal.error).to.be.true;
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
        const promise = Promise.resolve({ data: { data: [mockReservation] } });

        expect(reservationStore.state.reservation).to.deep.equal(emptyReservation);

        getStub.returns(promise); // set stub to return mock data

        return reservationStore.onFetchReservation().then(() => {
            expect(reservationStore.state.reservation).to.deep.equal(mockReservation);
            expect(reservationStore.state.error).to.equal("");
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
            expect(reservationStore.state.error).to.equal("");
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

    it("onReservationModalChanged - email", () => {
        expect(reservationStore.state.reservationModal.email).to.equal("");

        reservationStore.onReservationModalChanged("email", "email@email.com");

        expect(reservationStore.state.reservationModal.email).to.equal("email@email.com");
    });
});
