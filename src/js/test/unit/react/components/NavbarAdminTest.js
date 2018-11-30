import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import NavbarAdmin from "react/components/NavbarAdmin";
import Cookies from "universal-cookie";
import { LoginStore } from "../../../../react/login/LoginStore";

let clock, store = new LoginStore();
const sandbox = sinon.createSandbox(), cookies = new Cookies();

describe("Navbar Admin Tests", () => {

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
        cookies.remove("token");
        cookies.remove("refresh");
    });

    afterEach(() => {
        cookies.remove("token");
        cookies.remove("refresh");
        sandbox.restore();
        store = new LoginStore();
    });

    it("renders the navbar on top", () => {
        const component = shallow(<NavbarAdmin />);
        expect(component.instance()).to.instanceOf(NavbarAdmin);
    });

    it("isAdmin works", () => {
        const component = shallow(<NavbarAdmin />);
        let rv = null;
        cookies.set("refresh", { refresh: "refreshToken", logged: "admin" });

        rv = component.instance().isAdmin();
        expect(rv).to.be.true;
        cookies.set("refresh", { refresh: "refreshToken", logged: "someone" });
        rv = component.instance().isAdmin(cookies)
        expect(rv).to.be.false;
    });

    it("renders the admin navbar on top", () => {
        const component = shallow(<NavbarAdmin />);
        cookies.set("refresh", { refresh: "refreshToken", logged: "admin" });
        expect(component.instance()).to.be.instanceOf(NavbarAdmin);
    });

    it("getGearNav - authenticated as admin", () => {
        cookies.set("refresh", { refresh: "refreshToken", logged: "admin" });

        const component = shallow(<NavbarAdmin />),

            gearNav = component.instance().getGearNav();

        expect(gearNav).to.not.be.null;
    });

    it("getHeaderNav - authenticated path", () => {
        store.setState({ isAuthenticated: true });
        const component = shallow(<NavbarAdmin />);
        component.instance().setState({ isAuthenticated: true });
        expect(component.find("NavbarBrand").html()).to.equal('<span class="navbar-brand">Outdoors Club Administration</span>')
    });
});