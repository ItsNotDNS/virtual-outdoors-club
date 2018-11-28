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

    it("calls fetchedRentableGearList on mount", () => {
        const page = shallow(<RentPage />);
        actionsStub.fetchRentableGearList = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.fetchRentableGearList.calledOnce).to.be.true;

        page.instance().state.fetchedRentableGearList = true; // not set by the component

        page.instance().componentDidMount();

        expect(actionsStub.fetchGearList.calledOnce).to.be.false;
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

    it("getShoppingCart success", () => {
        const page = shallow(<RentPage />);
        page.instance().state.shoppingList = [];
        let rv = page.instance().getShoppingCart();
        expect(rv.props.children).to.equal("Empty Shopping Cart");
        page.instance().state.shoppingList = data;
        rv = page.instance().getShoppingCart();
        expect(rv.props.children === "Empty Shopping Cart").to.be.false;
    });

    it("handleFilterStartDateChange calls dateFilterChanged", () => {
        const page = shallow(<RentPage />),
            mockDate = moment("2013-03-01", "YYYY-MM-DD");
        actionsStub.dateFilterChanged = sandbox.spy();
        page.instance().handleFilterStartDateChange(mockDate);
        expect(actionsStub.dateFilterChanged.calledOnce).to.be.true;
    });

    it("handleFilterEndDateChange calls dateFilterChanged", () => {
        const page = shallow(<RentPage />),
            mockDate = moment("2013-03-01", "YYYY-MM-DD");
        actionsStub.dateFilterChanged = sandbox.spy();
        page.instance().handleFilterEndDateChange(mockDate);
        expect(actionsStub.dateFilterChanged.calledOnce).to.be.true;
    });

    it("componentDidUpdate success", () => {
        const page = shallow(<RentPage />),
            mockPrevProps = null,
            mockPrevState = {};
        actionsStub.fetchRentableListFromTo = sandbox.spy();
        page.instance().componentDidUpdate(mockPrevProps, mockPrevState);
        expect(actionsStub.fetchRentableListFromTo.calledOnce).to.be.false;
        page.instance().state.dateFilter.startDate = "2013-03-01";
        page.instance().componentDidUpdate(mockPrevProps, mockPrevState);
        expect(actionsStub.fetchRentableListFromTo.calledOnce).to.be.false;
        page.instance().state.dateFilter.endDate = "2013-03-03";
        page.instance().componentDidUpdate(mockPrevProps, mockPrevState);
        expect(actionsStub.fetchRentableListFromTo.calledOnce).to.be.true;
    });

});
