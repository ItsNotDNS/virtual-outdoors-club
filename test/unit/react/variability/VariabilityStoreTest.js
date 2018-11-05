import { VariableStore } from "react/variability/VariabilityStore";
import sinon from "sinon";
import { expect } from "chai";
import constants from "constants/constants";

const {
    EXECUTIVE,
    MEMBER
} = constants.variability;

let store = new VariableStore();

describe("VariabilityStore Tests", () => {
    beforeEach(() => {
        store = new VariableStore();
    });

    it("onUpdateAdminVariable - updates admin vars", () => {
        const name = "maxReservationLength",
            value = 99;

        store.onUpdateExecVariable({ name, value });
        expect(store.state[EXECUTIVE]).to.have.property(name, value);
        expect(store.state[MEMBER]).to.not.have.property(name, value);
        store.onUpdateMemberVariable({ name, value: 101 });
        expect(store.state[EXECUTIVE]).to.not.have.property(name, 101);
        expect(store.state[MEMBER]).to.have.property(name, 101);
    });
});
