import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ConfirmationDialog from "react/components/ConfirmationDialog";

describe("ConfirmationDialog Tests", () => {
    it("Renders", () => {
        const emptyFunc = () => {},
            dialog = shallow(
                <ConfirmationDialog
                    show
                    title="Test"
                    message="test error"
                    onClose={emptyFunc}
                    onSubmit={emptyFunc}
                />
            );

        expect(dialog.text(), "should show").contains("<ButtonModalForm />");
    });
});
