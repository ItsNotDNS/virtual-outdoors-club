import React from "react";
import GearStatisticChart from "react/statistics/GearStatisticChart";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Chart } from "react-chartjs-2";

var mockGearStatList = [{
        code: "FP01",
        usage: "42.86",
        description: "Frying Pan"
    }, {
        code: "T03",
        usage: "100.00",
        description: ""
    }, {
        code: "T03",
        usage: "10.00",
        description: ""
    }, {
        code: "T03",
        usage: "23.00",
        description: ""
    }, {
        code: "T03",
        usage: "70.00",
        description: ""
    }, {
        code: "BP12",
        usage: "87.00",
        description: "-20 Sleeping Bag, plus some long description string let's see how this fits"
    }];

describe("GearStatisticChart Tests", () => {

    // TODO - Figure out how to test this
    it("Displays the chart", () => {
        var page = shallow(<GearStatisticChart
                chart_id={"GearStatChart"}
                gearStatList={mockGearStatList}
                chart_type={"horizontalBar"}
            />);

        expect(page.exists()).to.be.equal(true);
    });
});
