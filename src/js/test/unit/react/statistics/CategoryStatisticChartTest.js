import React from "react";
import CategoryStatisticChart from "react/statistics/CategoryStatisticChart";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Chart } from "react-chartjs-2";
import sinon from "sinon";

var mockCategoryStatList = [{
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

describe("CategoryStatisticChart Tests", () => {

    // TODO - Figure out how to test this
    it("Displays the chart", () => {
        var page = shallow(<CategoryStatisticChart
                chart_id={"GearStatChart"}
                categoryStatList={mockCategoryStatList}
                chart_type={"horizontalBar"}
            />);

        expect(page.exists()).to.be.equal(true);
        //
    });
});
