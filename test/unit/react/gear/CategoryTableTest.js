import React from "react";
import CategoryTable from "react/gear/CategoryTable";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";

const mockCategoryList = [{
        name: "book"
    }, {
        name: "compass"
    }, {
        name: "sleeping bag"
    }, {
        name: "backpack"
    }],
    getShallowForm = (props = {}) => {
        const emptyFunc = () => {};

        return shallow(
            <CategoryTable
                onClickEdit={props.onClickEdit || emptyFunc}
                onClickDelete={props.onClickDelete || emptyFunc}
                categories={props.categories || []}
            />
        );
    };

describe("GearCategoryTable Tests", () => {
    it("generates an action column that uses the onClickEdit function passed in", () => {
        const editSpy = sinon.spy(),
            table = getShallowForm({
                onClickEdit: editSpy,
                categories: mockCategoryList
            }),
            actionCell = table.instance().getActionCell(null, mockCategoryList[0]),
            editBtn = actionCell.props.children[0];

        editBtn.props.onClick();

        expect(editSpy.calledWith(Constants.modals.EDITING, {
            category: { name: mockCategoryList[0].name }
        })).to.be.true;
    });

    it("generates an action column that uses the onClickDelete function passed in", () => {
        const deleteSpy = sinon.spy(),
            table = getShallowForm({
                onClickDelete: deleteSpy,
                categories: mockCategoryList
            }),
            actionCell = table.instance().getActionCell(null, mockCategoryList[0]),
            deleteBtn = actionCell.props.children[1];

        deleteBtn.props.onClick();

        expect(deleteSpy.calledWith(mockCategoryList[0].name)).to.be.true;
    });
});
