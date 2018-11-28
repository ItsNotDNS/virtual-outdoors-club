import ReservationService from "services/ReservationService";
import { expect } from "chai";
import sinon from "sinon";
import axios from "axios";

let getStub;
const mockGear = {
    "id": 1,
    "depositFee": "30.00",
    "code": "BK01",
    "description": "Book about hiking",
    "category": "book",
    "condition": "RENTABLE",
    "version": 1
},
sandbox = sinon.createSandbox();

describe("ReservationService Tests", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axios, "get");
    });

    afterEach(() => {
        sandbox.restore();
    });
});