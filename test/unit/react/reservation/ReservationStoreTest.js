import { ReservationStore } from "react/reservation/ReservationStore";
import sinon from "sinon";
import { expect } from "chai";
import axios from "axios";

let getStub, reservationStore = new ReservationStore();
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
}];

describe("ReservationStore Tests", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axios, "get");
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
});
