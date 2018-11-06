import { AccountsStore } from "react/accounts/AccountsStore";
import sinon from "sinon";
import { expect } from "chai";
import constants from "constants/constants";

const {
        EXECUTIVE,
        ADMIN
    } = constants.accounts,
    sandbox = sinon.createSandbox();

let store = new AccountsStore(),
    clock;

describe("VariabilityStore Tests", () => {
    beforeEach(() => {
        store = new AccountsStore();
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
});
