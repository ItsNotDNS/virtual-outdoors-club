import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import GearList from "react/components/GearList";

describe("GearList Tests", () => {
    it("returns a div row for a gear", () => {
        const gearList = shallow(<GearList gear={[{
            "id": 1,
            "code": "T13",
            "category": "Tent",
            "depositFee": "51.00",
            "description": "1 Tent 5 person",
            "condition": "RENTABLE",
            "statusDescription": "",
            "version": 1
        }]} />);

        console.log(gearList.instance())
        expect(gearList.text()).contains("T13");
    });
});
