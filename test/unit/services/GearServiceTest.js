import GearService from "services/GearService";
import axios from "axios";
import sinon from "sinon";
import { expect } from "chai";

const sandbox = sinon.createSandbox();

describe("GearService Tests", () => {
    afterEach(() => {
        sandbox.restore();
    });

    it("fetchGearList", () => {
        const testResponse = { value: "test object" },
            service = new GearService(),
            getStub = sinon.stub(axios, "get").callsFake((url) => {
                return testResponse;
            }),
            result = service.fetchGearList();

        expect(result).to.deep.equal(testResponse);
        expect(getStub.calledOnce).to.be.true;
    });
});
