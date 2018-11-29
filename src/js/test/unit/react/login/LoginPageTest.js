import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import LoginPage from "react/login/LoginPage";
import sinon from "sinon";
import Cookies from "universal-cookie";

const getShallowPage = (props = {}) => {
        const emptyFunc = () => { };

        return shallow(
            <LoginPage
                onChange={props.onChange || emptyFunc}
            />
        );
    },
    cookies = new Cookies();

describe("LoginPage Tests", () => {

    beforeEach(() => {
        cookies.remove("token");
        cookies.remove("refresh");
    });

    it("renders", () => {
        const component = shallow(<LoginPage />);
        expect(component.instance()).to.be.instanceOf(LoginPage);
    });

    it("handles changes", () => {
        const onChangeSpy = sinon.spy(),
            event = {
                target: {
                    name: "name",
                    value: "value"
                }
            },
            form = getShallowPage({ onChange: onChangeSpy });

        form.instance().handleChange(event);

        expect(onChangeSpy.calledWith(event.target.name, event.target.value));
    });
});
