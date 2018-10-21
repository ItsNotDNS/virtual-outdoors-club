import GearService from "services/GearService";
import sinon from "sinon";
import { expect } from "chai";

const sandbox = sinon.createSandbox();

describe("GearService Tests", () => {
    afterEach(() => {
        sandbox.restore();
    });
});
