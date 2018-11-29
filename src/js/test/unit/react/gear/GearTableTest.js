import React from "react";
import GearTable from "react/gear/GearTable";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";

const mockGearList = [{
        "id": 1,
        "depositFee": "30.00",
        "code": "BK01",
        "description": "Book about hiking",
        "category": "book",
        "condition": "RENTABLE",
        "version": 1,
        "statusDescription": "some status"
    }, {
        "id": 2,
        "depositFee": "30.00",
        "code": "BK02",
        "description": "Mountains 101",
        "category": "book",
        "condition": "RENTABLE",
        "version": 3,
        "statusDescription": "some status"
    }, {
        "id": 3,
        "depositFee": "50.00",
        "code": "TN01",
        "description": "Tent for 4 people",
        "category": "tent",
        "condition": "RENTABLE",
        "version": 1,
        "statusDescription": "some status"
    }],
    getShallowForm = (props = {}) => {
        const emptyFunc = () => {};

        return shallow(
            <GearTable
                onClickEdit={props.onClickEdit || emptyFunc}
                onClickDelete={props.onClickDelete || emptyFunc}
                gearList={props.gearList || []}
                checkboxOptions={props.checkboxOptions || {}}
            />
        );
    };

describe("GearTable Tests", () => {
    it("generates an action column that uses the onClickEdit function passed in", () => {
        const editSpy = sinon.spy(),
            table = getShallowForm({
                onClickEdit: editSpy,
                gearList: mockGearList
            }),
            actionCell = table.instance().getActionCell(null, mockGearList[0]),
            editBtn = actionCell.props.children[0];

        editBtn.props.onClick();

        expect(editSpy.calledWith(Constants.modals.EDITING, {
            gear: {
                id: mockGearList[0].id,
                expectedVersion: mockGearList[0].version,
                gearCode: mockGearList[0].code,
                depositFee: mockGearList[0].depositFee,
                gearDescription: mockGearList[0].description,
                gearCategory: mockGearList[0].category,
                gearCondition: mockGearList[0].condition,
                gearStatus: mockGearList[0].statusDescription
            }
        })).to.be.true;
    });

    it("generates an action column that uses the onClickDelete function passed in", () => {
        const deleteSpy = sinon.spy(),
            table = getShallowForm({
                onClickDelete: deleteSpy,
                gearList: mockGearList
            }),
            actionCell = table.instance().getActionCell(null, mockGearList[0]),
            deleteBtn = actionCell.props.children[1];

        deleteBtn.props.onClick();

        expect(deleteSpy.calledWith(mockGearList[0].id)).to.be.true;
    });

    it("conditionFormatter works", () => {
        const table = getShallowForm({
                gearList: mockGearList
            });

        let rv = null;
        rv = table.instance().conditionFormatter("RENTABLE");
        expect(rv.props.children).to.be.equal("Rentable");
        rv = table.instance().conditionFormatter("FLAGGED");
        expect(rv.props.children).to.be.equal("Flagged");
        rv = table.instance().conditionFormatter("NEEDS_REPAIR");
        expect(rv.props.children).to.be.equal("Needs Repair");
        rv = table.instance().conditionFormatter("DELETED");
        expect(rv.props.children).to.be.equal("Deleted");
    });

    it("categoryFormatter works", () => {
        const table = getShallowForm({
                gearList: mockGearList
            });

        let rv = null;
        rv = table.instance().categoryFormatter("some category");
        expect(rv).to.be.equal("some category");
        rv = table.instance().categoryFormatter("");
        expect(rv).to.be.equal("Category Deleted");
        rv = table.instance().categoryFormatter(null);
        expect(rv).to.be.equal("Category Deleted");

    });
});
