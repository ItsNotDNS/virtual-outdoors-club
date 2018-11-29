import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import { LoginStore } from "react/login/LoginStore";
import withAuth from "react/components/higherOrder/withAuth";
import GearPage from "react/gear/GearPage";
import RentPage from "react/gear/RentPage";
import Cookies from "universal-cookie";

const sandbox = sinon.createSandbox(),
    rentProps = { location: { pathname: "/rent" } },
    gearProps = { location: { pathname: "/gear" } },
    cookies = new Cookies();
    
let loginStore;

describe("withAuth Higher Order Tests", () => {

    beforeEach(() => {
        loginStore = new LoginStore();
        cookies.remove("token");
        cookies.remove("refresh");
    });

    afterEach(() => {
        sandbox.restore();
        cookies.remove("token");
        cookies.remove("refresh");
    });

    it("renders the login page if you are not authenticated", () => {
        const AuthComponent = withAuth(GearPage),
            Page = shallow(<AuthComponent {...gearProps} />).first().shallow();
        // initial state of authentication should be false
        expect(loginStore.state.isAuthenticated).to.be.false;
        expect(Page.text()).to.equal("<LoginPage />");
    });

    it("renders the protected page if you are authenticated", () => {
        const AuthComponent = withAuth(GearPage),
            AuthPage = shallow(<AuthComponent {...gearProps} />);
        // the page should then render the protect gear page
        AuthPage.instance().setState({ isAuthenticated: true });
        expect(AuthPage.text()).to.equal("<NavbarAdmin /><GearPage />");
    });

    it("renders the rent page without the navbar if you are in the rent path", () => {
        const AuthComponent = withAuth(RentPage),
            AuthPage = shallow(<AuthComponent {...rentProps} />);
        // the page should then render the protect gear page
        expect(AuthPage.text()).to.equal("<RentPage />");
    });

    it("does not update if isAuthenticated is not changed", () => {
    const AuthComponent = withAuth(GearPage),
        AuthPage = shallow(<AuthComponent {...gearProps} />),
        result = AuthPage.instance().shouldComponentUpdate({ isAuthenticated: false });
        expect(result).to.be.false;
    });

    it("does update if isAuthenticated is changed", () => {
        const AuthComponent = withAuth(GearPage),
            AuthPage = shallow(<AuthComponent {...gearProps} />),
            result = AuthPage.instance().shouldComponentUpdate({ isAuthenticated: true });
        expect(result).to.be.true;
    });
});
