import React from "react";
import GearModal from "react/gear/GearModal";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";

const getShallowForm = (props = {}) => {
    const emptyFunc = () => {};

    return shallow(
        <GearModal
            onClose={props.close || emptyFunc}
            onChange={props.onChange || emptyFunc}
            onSubmit={props.onSubmit || emptyFunc}
            onTabSelected={props.onTabSelected || emptyFunc}

            tabSelected={props.tabSelected || 1}

            formTitle={props.formTitle || "Some Title"}
            show={props.show || false}
            error={props.error || false}
            errorMessage={props.errorMessage || "Some Error"}
            gearCode={props.gearCode}
            depositFee={props.depositFee}
            gearDescription={props.gearDescription}
            gearCategory={props.gearCategory}
            gearHistory={props.gearHistory || []}
            gearReservationHistory={props.gearReservationHistory || []}
        />
    );
};

describe("GearModal Tests", () => {
    it("calls onChange when handleChange is called", () => {
        const onChangeSpy = sinon.spy(),
            event = {
                target: {
                    name: "name",
                    value: "value"
                }
            },
            form = getShallowForm({ onChange: onChangeSpy });

        form.instance().handleChange(event);

        expect(onChangeSpy.calledWith(event.target.name, event.target.value));
    });

    it("builds gear history table with data", () => {
        const gearHistory = [{
                    "id": 5,
                    "code": "BP01",
                    "category": "Backpack",
                    "depositFee": "25.00",
                    "description": "Burton Backpack",
                    "condition": "RENTABLE",
                    "statusDescription": "",
                    "version": 2
                },
                {
                    "id": 5,
                    "code": "BP01",
                    "category": "Backpack",
                    "depositFee": "51.00",
                    "description": "Burton Backpack",
                    "condition": "RENTABLE",
                    "statusDescription": "",
                    "version": 1
                }],
            form = getShallowForm({ gearHistory: gearHistory });

        expect(form.instance().getGearHistory(2).props.title).to.equal("Gear History");

    });

    it("builds gear reservation history table with data", () => {
        const gearReservationHistory = [
        {
            "id": 2,
            "email": "email@gmail.com",
            "licenseName": "some",
            "licenseAddress": "email",
            "startDate": "2018-11-30",
            "endDate": "2018-12-04",
            "status": "APPROVED",
            "gear": [
                {
                    "id": 14,
                    "code": "BP06",
                    "category": "Backpack",
                    "depositFee": "56.00",
                    "description": "Donated",
                    "condition": "RENTABLE",
                    "statusDescription": "",
                    "version": 1
                },
                {
                    "id": 15,
                    "code": "BP07",
                    "category": "Backpack",
                    "depositFee": "57.00",
                    "description": "Burton Backpack",
                    "condition": "RENTABLE",
                    "statusDescription": "",
                    "version": 1
                }
            ],
            "version": 1
        },
        {
            "id": 1,
            "email": "asdf@gmail.com",
            "licenseName": "asdf",
            "licenseAddress": "fdsa",
            "startDate": "2018-11-26",
            "endDate": "2018-11-27",
            "status": "APPROVED",
            "gear": [
                {
                    "id": 10,
                    "code": "BP02",
                    "category": "Backpack",
                    "depositFee": "52.00",
                    "description": "Quiksilver Backpack",
                    "condition": "RENTABLE",
                    "statusDescription": "",
                    "version": 1
                },
                {
                    "id": 12,
                    "code": "BP04",
                    "category": "Backpack",
                    "depositFee": "54.00",
                    "description": "Burton Backpack",
                    "condition": "RENTABLE",
                    "statusDescription": "",
                    "version": 1
                }
            ],
            "version": 1
        }
    ],
            form = getShallowForm({ gearReservationHistory: gearReservationHistory });

        expect(form.instance().getGearReservationHistory(3).props.title).to.equal("Gear Reservation History");

    });
});
