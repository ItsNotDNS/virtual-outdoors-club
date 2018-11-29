import { AccountsStore } from "react/accounts/AccountsStore";
import sinon from "sinon";
import { expect } from "chai";
import constants from "constants/constants";
import axios from "axios";

const {
        EXECUTIVE,
        ADMIN
    } = constants.accounts,
    sandbox = sinon.createSandbox();

let store = new AccountsStore(),
    clock, postStub;

describe("AccountStore Tests", () => {
    beforeEach(() => {
        store = new AccountsStore();
        postStub = sandbox.stub(axios, "post");
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });

    it("onUpdateAdminVariable - updates admin vars", () => {
        const name = "newAdmin",
            value = "guest";

        store.onUpdateAdminVariable({ name, value });
        expect(store.state[ADMIN]).to.have.property(name, value);
        expect(store.state[EXECUTIVE]).to.not.have.property(name);
    });

    it("onUpdateExecVariable - updates admin vars", () => {
        const name = "newExec",
            value = "guest";

        store.onUpdateExecVariable({ name, value });
        expect(store.state[EXECUTIVE]).to.have.property(name, value);
        expect(store.state[ADMIN]).to.not.have.property(name);
    });

    it("updateVariable - sets a new timeout", () => {
        const name = "newExec",
            value = "guest";

        store.state.timeout = 999;
        expect(store.state.timeout).to.equal(999);
        store.updateVariable(EXECUTIVE, { name, value });
        expect(store.state.timeout).to.not.equal(999);
    });

    it("updateVariable - calls a timeout function", () => {
        const callbackStub = sandbox.stub(store, "checkIfValid"),
            name = "newExec",
            value = "guest";

        store.updateVariable(EXECUTIVE, { name, value });
        expect(callbackStub.calledOnce).to.be.false;
        clock.tick(300);
        expect(callbackStub.calledOnce).to.be.false;
        clock.tick(200);
        expect(callbackStub.calledOnce).to.be.true;
    });

    it("checkIfValid - admin error and success", () => {
        store.state[ADMIN].oldAdmin = "someOldPass";
        store.state[ADMIN].newAdmin = "myNewPass";
        store.state[ADMIN].confirmAdmin = "myNewPassOops";

        store.checkIfValid();

        expect(store.state[ADMIN].canSubmit).to.be.false;

        store.state[ADMIN].confirmAdmin = store.state[ADMIN].newAdmin;

        store.checkIfValid();

        expect(store.state[ADMIN].canSubmit).to.be.true;
    });

    it("checkIfValid - exec error and success", () => {
        store.state[EXECUTIVE].newExec = "myNewPass";
        store.state[EXECUTIVE].confirmExec = "myNewPassOops";

        store.checkIfValid();

        expect(store.state[EXECUTIVE].canSubmit).to.be.false;

        store.state[EXECUTIVE].confirmExec = store.state[EXECUTIVE].newExec;

        store.checkIfValid();

        expect(store.state[EXECUTIVE].canSubmit).to.be.true;
    });

    it("onUpdateAdminPassword - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            errorPromise = Promise.reject(error);
        store.state[ADMIN].newAdmin = "admin";
        store.state[ADMIN].confirmAdmin = "myNewPassOops";
        store.state[ADMIN].oldAdmin = "password";

        expect(store.state[ADMIN].newAdmin).to.equal("admin");
        expect(store.state[ADMIN].confirmAdmin).to.equal("myNewPassOops");
        expect(store.state[ADMIN].oldAdmin).to.equal("password");

        postStub.returns(errorPromise);

        return store.onUpdateAdminPassword().then(() => {
            expect(store.state[ADMIN].newAdmin).to.equal("");
            expect(store.state[ADMIN].confirmAdmin).to.equal("");
            expect(store.state[ADMIN].oldAdmin).to.equal("");
            expect(store.state[ADMIN].error).to.equal(error.response.data.message);
        });
    });

    it("onUpdateAdminPassword - success path", () => {
        const resolvePromise = Promise.resolve("");
        store.state[ADMIN].newAdmin = "admin";
        store.state[ADMIN].confirmAdmin = "myNewPassOops";
        store.state[ADMIN].oldAdmin = "password";

        expect(store.state[ADMIN].newAdmin).to.equal("admin");
        expect(store.state[ADMIN].confirmAdmin).to.equal("myNewPassOops");
        expect(store.state[ADMIN].oldAdmin).to.equal("password");

        postStub.returns(resolvePromise);

        return store.onUpdateAdminPassword().then(() => {
            expect(store.state[ADMIN].newAdmin).to.equal("");
            expect(store.state[ADMIN].confirmAdmin).to.equal("");
            expect(store.state[ADMIN].oldAdmin).to.equal("");
            expect(store.state[ADMIN].error).to.equal("");
        });
    });

    it("onUpdateExecutivePassword - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            errorPromise = Promise.reject(error);
        store.state[EXECUTIVE].newExec = "EXECUTIVE";
        store.state[EXECUTIVE].confirmExec = "myNewPassOops";

        expect(store.state[EXECUTIVE].newExec).to.equal("EXECUTIVE");
        expect(store.state[EXECUTIVE].confirmExec).to.equal("myNewPassOops");

        postStub.returns(errorPromise);

        return store.onUpdateExecutivePassword().then(() => {
            expect(store.state[EXECUTIVE].newExec).to.equal("");
            expect(store.state[EXECUTIVE].confirmExec).to.equal("");
            expect(store.state[EXECUTIVE].error).to.equal(error.response.data.message);
        });
    });

    it("onUpdateExecutivePassword - success path", () => {
        const resolvePromise = Promise.resolve("");
        store.state[EXECUTIVE].newExec = "executive";
        store.state[EXECUTIVE].confirmExec = "myNewPassOops";

        expect(store.state[EXECUTIVE].newExec).to.equal("executive");
        expect(store.state[EXECUTIVE].confirmExec).to.equal("myNewPassOops");

        postStub.returns(resolvePromise);

        return store.onUpdateExecutivePassword().then(() => {
            expect(store.state[EXECUTIVE].newExec).to.equal("");
            expect(store.state[EXECUTIVE].confirmExec).to.equal("");
            expect(store.state[EXECUTIVE].error).to.equal("");
        });
    });
});
