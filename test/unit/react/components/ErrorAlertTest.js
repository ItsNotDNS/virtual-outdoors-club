import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ErrorAlert from "react/components/ErrorAlert";

describe("ErrorAlert Tests", () => {
    it("shows an error if show:true, null if show:false", () => {
        const showError = shallow(<ErrorAlert show errorMessage="test error" />),
            nullError = shallow(<ErrorAlert show={false} errorMessage="test error" />);

        expect(showError.text(), "should show").contains("<Alert />");
        expect(nullError.text(), "should hide").equals("");
    });
});
