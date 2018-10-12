import React from "react";
import GearPage from "react/gear/GearPage";
import { expect } from "chai";
import { shallow } from "enzyme";

describe("GearPage Tests", () => {
    it("Renders Hello, without errors", () => {
        const page = shallow(<GearPage />);

        expect(page.text()).to.contain("Hello I am a gear page");
    });
});
