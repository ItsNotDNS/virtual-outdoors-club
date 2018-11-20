import { VariableStore } from "react/variability/VariabilityStore";
import sinon from "sinon";
import { expect } from "chai";
import constants from "constants/constants";
import axios from "axios";

const {
    EXECUTIVE,
    MEMBER
} = constants.variability,
    sandbox = sinon.createSandbox();

let store = new VariableStore(),
    getStub,
    postStub;

describe("VariabilityStore Tests", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axios, "get");
        postStub = sandbox.stub(axios, "post");
    });

    afterEach(() => {
        sandbox.restore();
        store = new VariableStore();
    });

    it("onUpdateAdminVariable - updates admin vars", () => {
        const name = "maxReservationLength",
            value = 99;

        store.onUpdateExecVariable({ name, value });
        expect(store.state.settings[EXECUTIVE]).to.have.property(name, value);
        expect(store.state.settings[MEMBER]).to.not.have.property(name, value);
        store.onUpdateMemberVariable({ name, value: 101 });
        expect(store.state.settings[EXECUTIVE]).to.not.have.property(name, 101);
        expect(store.state.settings[MEMBER]).to.have.property(name, 101);
    });

    it("onFetchSystemVariables - error path", () => {
        const error = { response: { data: { message: "Error message" } } };
        getStub.returns(Promise.reject(error));
        return store.onFetchSystemVariables().then(() => {
            expect(store.state.error).to.be.true;
        });
    });

    it("onFetchSystemVariables - unexpected error path", () => {
        const error = { response: { data: {} } };
        getStub.returns(Promise.reject(error));
        return store.onFetchSystemVariables().then(() => {
            expect(store.state.error).to.be.true;
        });
    });

    it("onFetchSystemVariables - success path", () => {
        getStub.returns(Promise.resolve({ data: {
            data: [
                {variable: "membermaxRentals", value: 8},
                {variable: "membermaxFuture", value: 7},
                {variable: "membermaxLength", value: 12},
                {variable: "executivemaxRentals", value: 5},
                {variable: "executivemaxFuture", value: 4},
                {variable: "executivemaxLength", value: 6}
            ] } }));
        return store.onFetchSystemVariables().then(() => {
            expect(store.state.error).to.be.false;
            expect(store.state.settings[EXECUTIVE].maxReservationLength).to.equal(6);
            expect(store.state.settings[EXECUTIVE].maxDaysInFutureCanStart).to.equal(4);
            expect(store.state.settings[EXECUTIVE].maxItemsReserved).to.equal(5);
            expect(store.state.settings[MEMBER].maxReservationLength).to.equal(12);
            expect(store.state.settings[MEMBER].maxDaysInFutureCanStart).to.equal(7);
            expect(store.state.settings[MEMBER].maxItemsReserved).to.equal(8);
        });
    });

    it("onSaveSystemVariables - error path", () => {
        const error = { response: { data: { message: "Error message" } } };
        postStub.returns(Promise.reject(error));
        return store.onSaveSystemVariables().then(() => {
            expect(store.state.error).to.be.true;
        });
    });

    it("onSaveSystemVariables - unexpected error path", () => {
        const error = { response: { data: { } } };
        postStub.returns(Promise.reject(error));
        return store.onSaveSystemVariables().then(() => {
            expect(store.state.error).to.be.true;
        });
    });

    it("onSaveSystemVariables - success path", () => {
        const error = { response: { data: { message: "Error message" } } };
        postStub.returns(Promise.resolve({}));
        return store.onSaveSystemVariables().then(() => {
            expect(store.state.error).to.be.false;
        });
    });
});
