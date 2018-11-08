import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ButtonModalForm from "react/components/ButtonModalForm";

const getShallowForm = (props = {}) => {
    const emptyFunc = () => {};
    return shallow(
        <ButtonModalForm
            onSubmit={props.onSubmit || emptyFunc}
            onClose={props.onClose || emptyFunc}
            formTitle={props.formTitle || "some title"}
            children={props.children || [<div key={1}>I'm a child</div>]}
            show={props.show || false}
            error={props.error || false}
            errorMessage={props.errorMessage || ""}
        />
    );
};

describe("ButtonModalForm Tests", () => {
    it("renders without errors", () => {
        const form = getShallowForm();

        expect(form.find("Modal")).to.have.length(1);
    });
});
