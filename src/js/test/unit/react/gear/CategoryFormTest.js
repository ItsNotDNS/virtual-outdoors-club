import React from "react";
import CategoryFrom from "react/gear/CategoryForm";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";

const getShallowForm = (props = {}) => {
    const emptyFunc = () => {};

    return shallow(
        <CategoryFrom
            onClose={props.close || emptyFunc}
            onChange={props.onChange || emptyFunc}
            onSubmit={props.onSubmit || emptyFunc}
            formTitle={props.formTitle || "Some Title"}
            show={props.show || false}
            error={props.error || false}
            errorMessage={props.errorMessage || "Some Error"}
            gearCode={props.gearCode}
            depositFee={props.depositFee}
            gearDescription={props.gearDescription}
            gearCategory={props.gearCategory}
        />
    );
};

describe("CategoryFrom Tests", () => {
    it("calls onChange when handleChange is called", () => {
        const onChangeSpy = sinon.spy(),
            event = {
                target: {
                    name: "name",
                    value: "value"
                }
            },
            form = getShallowForm({ onChange: onChangeSpy });

        form.instance().handleChange(event);

        expect(onChangeSpy.calledWith(event.target.name, event.target.value));
    });
});
