import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import NavbarAdmin from "react/components/NavbarAdmin";

describe("Navbar Admin Tests", () => {
    it("renders the navbar on top", () => {
        const component = shallow(<NavbarAdmin />);
        expect(component.instance()).to.instanceOf(NavbarAdmin);
    });
});