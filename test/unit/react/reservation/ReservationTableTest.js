import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ReservationTable from "react/reservation/ReservationTable";

// initialize mock data and shallow table
const mockReservationList = [{
        "id": 15,
        "email": "test@gmail.com",
        "licenseName": "The full name on the ID.",
        "licenseAddress": "The address on the ID.",
        "startDate": "2018-10-21",
        "endDate": "2018-10-24",
        "status": "RESERVED",
        "gear": [{
            "id": 2,
            "gearCode": "MP01",
            "category": "map",
            "checkedOut": false,
            "depositFee": 50.0,
            "gearDescription": "GT01 - Jasper and Malgine Lake - 1:100,000 - Tyvek",
            "condition": "RENTABLE"
        }]
    }],
    getShallowForm = () => {
        return shallow(
            <ReservationTable reservationList={mockReservationList} />
        );
    };

describe("ReservationTable Tests", () => {
    it("should render correctly", () => {
        const component = getShallowForm();
        expect(component.text()).to.equal("<BootstrapTableContainer />");
    });
});
