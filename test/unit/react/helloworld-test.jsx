import React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import HelloWorld from "react/HelloWorld";

describe("Hello World Tests", () => {
    it("Renders 'Hello World!!'", () => {
        const component = shallow(<HelloWorld />);
        expect(component.text()).equals("Hello World!!");
    });
});