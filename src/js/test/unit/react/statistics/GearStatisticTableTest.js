import React from "react";
import GearStatisticTable from "react/statistics/GearStatisticTable";
import { expect } from "chai";
import { shallow } from "enzyme";

const mockGearStatList = [{
        code: "FP01",
        usage: "42.86",
        description: "Frying Pan"
    }, {
        code: "T03",
        usage: "100.00",
        description: ""
    }, {
        code: "BP12",
        usage: "87.00",
        description: "-20 Sleeping Bag, plus some long description string let's see how this fits"
    }];

describe("GearStatisticTable Tests", () => {
    it("Displays the table", () => {
        const page = shallow(<GearStatisticTable
                gearStatList={mockGearStatList}
            />);
        expect(page.exists()).to.be.equal(true);
    });
});
