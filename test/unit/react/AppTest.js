import React from "react";
import App from "react/App";
import { expect } from "chai";
import { shallow } from "enzyme";
import LoginPage from "react/login/LoginPage";
import GearPage from "react/gear/GearPage";

describe("App Tests", () => {
    it("Renders react-router without throwing errors.", () => {
        const app = shallow(<App />);

        expect(app.getElement().type.name).to.equal("BrowserRouter");
    });

    it("should render the Navbar wrapper function without errors", () => {
        const testPage = GearPage,
            app = shallow(<App />),
            returnFunction = app.instance().AdminWrapper(testPage),
            props = {
                location: {
                    pathname: "/gear"
                }
            };
        expect(returnFunction(props).type).to.equal("div");
    });

    it("should not render the Navbar without errors", () => {
        const testPage = LoginPage,
            app = shallow(<App />),
            returnFunction = app.instance().AdminWrapper(testPage),
            props = {
                location: {
                    pathname: "/login"
                }
            };
        expect(returnFunction(props).type).to.equal("div");
    });
});
