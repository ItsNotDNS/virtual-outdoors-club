import React from "react";
import CategoryStatisticTable from "react/statistics/CategoryStatisticTable";
import { expect } from "chai";
import { shallow } from "enzyme";

const mockCategoryStatList = [{
        code: "Frying Pan",
        usage: "42.86"
    }, {
        code: "Tarp",
        usage: "100.00"
    }, {
        code: "Backpacks",
        usage: "87.00"
    }, {
        code: "Maps",
        usage: "71.43"
    }];

describe("CategoryStatisticTable Tests", () => {
    it("Displays the table", () => {
        const page = shallow(<CategoryStatisticTable
                gearStatList={mockCategoryStatList}
            />);
        expect(page.exists()).to.be.equal(true);
    });
});
