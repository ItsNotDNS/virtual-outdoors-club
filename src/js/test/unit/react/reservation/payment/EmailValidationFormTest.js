import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import EmailValidationForm from "react/reservation/payment/EmailValidationForm";
import sinon from "sinon";

const getShallowForm = (props = {}) => {
    const emptyFunc = () => {};

    return shallow(
        <EmailValidationForm
            onChange={props.onChange || emptyFunc}
            onSubmit={props.onSubmit || emptyFunc}

            error={props.error || false}
            errorMessage={props.errorMessage || ""}
        />
    );
};

describe("EmailValidationForm Tests", () => {
    it("renders", () => {
        const form = getShallowForm();

        expect(form.text()).to.equal("<ErrorAlert />Please enter your email to view your reservation.<LabeledInput /><Button />");
    });

    it("calls onChange when handleChange is called", () => {
        const onChangeSpy = sinon.spy(),
            event = {
                target: {
                    name: "email",
                    value: "email@email.com"
                }
            },
            form = getShallowForm({ onChange: onChangeSpy });

        form.instance().handleChange(event);

        expect(onChangeSpy.calledWith(event.target.name, event.target.value));
    });
});
