import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import RentGearTable from "react/gear/RentGearTable";
import BootstrapTable from "react-bootstrap-table-next";
import sinon from "sinon";

describe("RentGearList Tests", () => {
    const mockGearList = [{
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

    it("Renders rent gear list without errors", () => {
        let testSubmit = function() {},
            component = shallow(
                <RentGearTable
                    gearList={mockGearList}
                    addToCart={testSubmit}
                />
            );
        expect(component.is(BootstrapTable)).to.be.true;
    });

    it("generates a column that uses the addToCart function passed in", () => {
        const addSpy = sinon.spy(),
            table = shallow(
                <RentGearTable
                    gearList={mockGearList}
                    addToCart={addSpy}
                />),
            cell = table.instance().addButtonFormatter(null, mockGearList[0]),
            addButton = cell.props;

        addButton.onClick();

        expect(addSpy.calledWith(mockGearList[0])).to.be.true;
    });

});
