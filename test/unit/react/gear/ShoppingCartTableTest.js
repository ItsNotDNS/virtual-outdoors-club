import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import BootstrapTable from "react-bootstrap-table-next";
import sinon from "sinon";
import ShoppingCartList from "react/gear/ShoppingCartTable";

describe("RentGearTable Tests", () => {
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

    it("Renders shopping cart without errors", () => {
        let testSubmit = function() {},
            component = shallow(
                <ShoppingCartList
                    gearList={mockGearList}
                    removeFromCart={testSubmit}
                />
            );
        expect(component.is(BootstrapTable)).to.be.true;
    });

    it("generates a column that uses the removeFromCart function passed in", () => {
        const removeSpy = sinon.spy(),
            table = shallow(
                <ShoppingCartList
                    shoppingList={mockGearList}
                    removeFromCart={removeSpy}
                />),
            cell = table.instance().removeButtonFormatter(null, mockGearList[0]),
            removeButton = cell.props;

        removeButton.onClick();

        expect(removeSpy.calledWith(mockGearList[0])).to.be.true;
    });
});
