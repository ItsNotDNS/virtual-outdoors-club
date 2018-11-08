import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import LoginPage from "react/login/LoginPage";

describe("LoginPage Tests", () => {
    it("renders", () => {
        const component = shallow(<LoginPage />);
        expect(component.instance()).to.be.instanceOf(LoginPage);
    });

    it("handles onChange", () => {
        const onChangeSpy = sinon.spy(),
            event = {
                target: {
                    name: "name",
                    value: "value"
                }
            },
            component = shallow(<LoginPage onChange={onChangeSpy} />);

        component.instance().handleChange(event);

        expect(onChangeSpy.calledWith(event.target.name, event.target.value));
    });
});
