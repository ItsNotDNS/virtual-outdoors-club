import React from "react";
import App from "react/App";
import { expect } from "chai";
import { shallow } from "enzyme";

describe("App Tests", () => {
    it("Renders react-router without throwing errors.", () => {
        const app = shallow(<App />);

        expect(app.getElement().type.name).to.equal("BrowserRouter");
    });

    // test shouldComponentUpdate
    it("Does not update the App router page when a state has been changed.", () => {
        const app = shallow(<App />);

        const result = app.instance().shouldComponentUpdate();

        expect(result).to.equal(false);
    });
});
