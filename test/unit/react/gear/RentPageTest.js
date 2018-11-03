import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import RentPage from "react/gear/RentPage";
import { GearActions } from "react/gear/GearStore";
import sinon from "sinon";
import moment from "moment";

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

    it("Renders RentPage successfully", () => {
        const page = shallow(<RentPage />);
        expect(page.find("ShoppingCartList").length).to.equals(1);
        expect(page.find("RentGearTable").length).to.equals(1);
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

    it("calls onChange when handleChange is called", () => {
        const event = {
                target: {
                    name: "name",
                    value: "value"
                }
            },
            page = shallow(<RentPage />);
        actionsStub.reserveGearFormChanged = sandbox.spy();
        page.instance().handleChange(event);

        expect(actionsStub.reserveGearFormChanged.calledWith(event.target.name, event.target.value)).to.be.true;
    });

    it("rental page shows rental gear list and shopping list", () => {
        const rentPage = shallow(<RentPage />);
        expect(rentPage.text().includes("<RentGearTable />", "<ShoppingCartList />")).to.be.true;
        expect(rentPage.text().includes("Member Information", "<ShoppingCartList />")).to.be.false;
    });

    it("rental page shows checkout form and shopping list", () => {
        const rentPage = shallow(<RentPage />);
        rentPage.instance().state.reserveGearForm.show = true;
        const newRentPage = shallow(<RentPage />);
        expect(newRentPage.text().includes("<RentGearTable />", "<ShoppingCartList />")).to.be.false;
        expect(newRentPage.text().includes("Member Information", "<ShoppingCartList />")).to.be.true;
    });

    it("handleStartDateChange calls reserveGearFormChanged", () => {
        const page = shallow(<RentPage />),
            mockDate = moment("2013-03-01", "YYYY-MM-DD");
        actionsStub.reserveGearFormChanged = sandbox.spy();
        page.instance().handleStartDateChange(mockDate);
        expect(actionsStub.reserveGearFormChanged.calledOnce).to.be.true;
    });

    it("handleEndDateChange calls reserveGearFormChanged", () => {
        const page = shallow(<RentPage />),
            mockDate = moment("2013-03-01", "YYYY-MM-DD");
        actionsStub.reserveGearFormChanged = sandbox.spy();
        page.instance().handleEndDateChange(mockDate);
        expect(actionsStub.reserveGearFormChanged.calledOnce).to.be.true;
    });
});
