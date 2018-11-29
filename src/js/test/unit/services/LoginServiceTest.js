import sinon from "sinon";
import { LoginStore } from "../../../react/login/LoginStore";
import axiosAuth, { setAxiosWithAuth } from "constants/axiosConfig";

const sandbox = sinon.createSandbox();
describe("LoginService tests", () => {

    beforeEach(() => {
        postStub = sandbox.stub(axiosAuth.axiosSingleton, "post");
        store = new LoginStore();
    });

    afterEach(() => {
        sandbox.restore();
    });
});