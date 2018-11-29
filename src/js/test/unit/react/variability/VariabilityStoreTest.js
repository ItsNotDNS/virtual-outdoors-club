import { VariableStore } from "react/variability/VariabilityStore";
import sinon from "sinon";
import { expect } from "chai";
import constants from "constants/constants";
import axiosAuth from "../../../../constants/axiosConfig";

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
        getStub = sandbox.stub(axiosAuth.axiosSingleton, "get");
        postStub = sandbox.stub(axiosAuth.axiosSingleton, "post");
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
            expect(store.state.fetchError).to.be.true;
        });
    });

    it("onFetchSystemVariables - unexpected error path", () => {
        const error = { response: { data: {} } };
        getStub.returns(Promise.reject(error));
        return store.onFetchSystemVariables().then(() => {
            expect(store.state.fetchError).to.be.true;
        });
    });

    it("onFetchSystemVariables - success path", () => {
        getStub.returns(Promise.resolve({ data: {
            data: [
                {variable: "executivemaxGearPerReservation", value: 6},
                {variable: "executivemaxFuture", value: 7},
                {variable: "executivemaxLength", value: 5},
                {variable: "executivemaxReservations", value: 8},
                {variable: "membermaxGearPerReservation", value: 10},
                {variable: "membermaxFuture", value: 11},
                {variable: "membermaxLength", value: 9},
                {variable: "membermaxReservations", value: 12}
            ] } }));
        return store.onFetchSystemVariables().then(() => {
            expect(store.state.error).to.be.false;

            expect(store.state.settings[EXECUTIVE].maxItemsReserved).to.equal(6);
            expect(store.state.settings[EXECUTIVE].maxDaysInFutureCanStart).to.equal(7);
            expect(store.state.settings[EXECUTIVE].maxReservationLength).to.equal(5);
            expect(store.state.settings[EXECUTIVE].maxReservations).to.equal(8);

            expect(store.state.settings[MEMBER].maxItemsReserved).to.equal(10);
            expect(store.state.settings[MEMBER].maxDaysInFutureCanStart).to.equal(11);
            expect(store.state.settings[MEMBER].maxReservationLength).to.equal(9);
            expect(store.state.settings[MEMBER].maxReservations).to.equal(12);
        });
    });

    it("onSaveExecSystemVariables - error path", () => {
        const error = { response: { data: { message: "Error message" } } };
        postStub.returns(Promise.reject(error));
        return store.onSaveExecSystemVariables().then(() => {
            expect(store.state.error).to.be.true;
        });
    });

    it("onSaveExecSystemVariables - unexpected error path", () => {
        const error = { response: { data: { } } };
        postStub.returns(Promise.reject(error));
        return store.onSaveExecSystemVariables().then(() => {
            expect(store.state.error).to.be.true;
        });
    });

    it("onSaveExecSystemVariables - success path", () => {
        postStub.returns(Promise.resolve({}));
        return store.onSaveExecSystemVariables().then(() => {
            expect(store.state.error).to.be.false;
        });
    });


    it("onSaveMemberSystemVariables - error path", () => {
        const error = { response: { data: { message: "Error message" } } };
        postStub.returns(Promise.reject(error));
        return store.onSaveMemberSystemVariables().then(() => {
            expect(store.state.error).to.be.true;
        });
    });

    it("onSaveMemberSystemVariables - unexpected error path", () => {
        const error = { response: { data: { } } };
        postStub.returns(Promise.reject(error));
        return store.onSaveMemberSystemVariables().then(() => {
            expect(store.state.error).to.be.true;
        });
    });

    it("onSaveMemberSystemVariables - success path", () => {
        postStub.returns(Promise.resolve({}));
        return store.onSaveMemberSystemVariables().then(() => {
            expect(store.state.error).to.be.false;
        });
    });
});
