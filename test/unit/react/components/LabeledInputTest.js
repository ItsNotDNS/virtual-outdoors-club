import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import LabeledInput from "react/components/LabeledInput";

describe("LabeledInput Tests", () => {
    it("Renders without errors", () => {
        const component = shallow(
            <LabeledInput name="testName" label="testLabel" />
        );

        expect(component.text()).equals("<FormGroup />");
    });
});
