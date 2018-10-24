import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import RentPage from "react/gear/RentPage";
import { GearActions } from "react/gear/GearStore";
import sinon from "sinon";

const sandbox = sinon.createSandbox();
let actionsStub;

describe("RentPage Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(GearActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    const data = [{
        "id": 1,
        "depositFee": "30.00",
        "code": "BK01",
        "description": "Book about hiking",
        "category": "book",
        "version": 1
    }, {
        "id": 2,
        "depositFee": "30.00",
        "code": "BK02",
        "description": "Mountains 101",
        "category": "book",
        "version": 3
    }, {
        "id": 3,
        "depositFee": "50.00",
        "code": "TN01",
        "description": "Tent for 4 people",
        "category": "tent",
        "version": 1
    }];

    it("Renders RentPage, without errors", () => {
        const page = shallow(<RentPage />);
        expect(page.find("ShoppingCartList").length).to.equals(1);
        expect(page.find("RentGearList").length).to.equals(1);
    });

    it("calls fetchedGearList on mount", () => {
        const page = shallow(<RentPage />);
        actionsStub.fetchGearList = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.fetchGearList.calledOnce).to.be.true;

        page.instance().state.fetchedGearList = true; // not set by the component

        page.instance().componentDidMount();

        expect(actionsStub.fetchGearList.calledOnce).to.be.true;
    });
});
