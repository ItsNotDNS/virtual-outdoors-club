import React from "react";
import App from "react/App";
import { expect } from "chai";
import { shallow } from "enzyme";
import Cookies from "universal-cookie";
import sinon from "sinon";
import { LoginStore, LoginActions } from "react/login/LoginStore";

const cookies = new Cookies(), sandbox = sinon.createSandbox();
let store = new LoginStore();
describe("App Tests", () => {

    beforeEach(() => {
        cookies.remove("token");
        cookies.remove("refresh");
    });

    afterEach(() => {
        cookies.remove("token");
        cookies.remove("refresh");
        sandbox.restore();
        store = new LoginStore();
    });

    it("Renders react-router without throwing errors.", () => {
        const app = shallow(<App />);

        expect(app.getElement().type.name).to.equal("BrowserRouter");
    });

    // test shouldComponentUpdate
    it("Does not update the App router page when a state has been changed.", () => {
        const app = shallow(<App />);

        const result = app.instance().shouldComponentUpdate();

        expect(result).to.equal(false);
    });

    it("calls componentDidMount if both cookies present", () => {
        cookies.set("refresh", { refresh: "refreshToken", logged: "whatever" });
        cookies.set("token", "whatever");
        const actionStub = sandbox.stub(LoginActions, "refreshToken"),
            app = shallow(<App />);
            

        expect(actionStub.calledOnce).to.be.true;
    });
});
