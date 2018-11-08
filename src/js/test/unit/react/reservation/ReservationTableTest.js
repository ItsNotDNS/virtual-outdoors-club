import React from "react";
import ReservationTable from "react/reservation/ReservationTable";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";

const mockReservationList = [{
        "id": 1,
        "email": "eric@gmail.com",
        "licenseName": "Eric Emmy",
        "licenseAddress": "1234 56 St",
        "status": "REQUESTED",
        "startDate": "2018-10-30",
        "endDate": "2018-11-02",
        "gear": [{
            "id": 2,
            "gearCode": "MP01",
            "category": "map",
            "checkedOut": false,
            "depositFee": 50.0,
            "gearDescription": "GT01 - Jasper and Malgine Lake - 1:100,000 - Tyvek",
            "condition": "RENTABLE"
        }]
    }, {
        "id": 2,
        "email": "frank@gmail.com",
        "licenseName": "Frank Franky",
        "licenseAddress": "1111 11 St",
        "status": "CANCELLED",
        "startDate": "2018-10-30",
        "endDate": "2018-11-02",
        "gear": [{
            "id": 2,
            "gearCode": "MP01",
            "category": "map",
            "checkedOut": false,
            "depositFee": 50.0,
            "gearDescription": "GT01 - Jasper and Malgine Lake - 1:100,000 - Tyvek",
            "condition": "RENTABLE"
        }]
    }, {
        "id": 3,
        "email": "jamie@gmail.com",
        "licenseName": "Jamie Jamison",
        "licenseAddress": "2222 22 St",
        "status": "REQUESTED",
        "startDate": "2018-11-10",
        "endDate": "2018-11-12",
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
    getShallowForm = (props = {}) => {
        const emptyFunc = () => {};

        return shallow(
            <ReservationTable
                onClickEdit={props.onClickEdit || emptyFunc}
                onClickDelete={props.onClickDelete || emptyFunc}
                reservationList={props.reservationList || []}
            />
        );
    };

describe("GearTable Tests", () => {
    it("generates an action column that uses the onClickEdit function passed in", () => {
        const editSpy = sinon.spy(),
            table = getShallowForm({
                onClickEdit: editSpy,
                reservationList: mockReservationList
            }),
            actionCell = table.instance().getActionCell(null, mockReservationList[0]),
            editBtn = actionCell.props.children[0];

        editBtn.props.onClick();

        expect(editSpy.calledWith(Constants.modals.EDITING, {
            reservation: {
                id: mockReservationList[0].id,
                email: mockReservationList[0].email,
                licenseName: mockReservationList[0].licenseName,
                licenseAddress: mockReservationList[0].licenseAddress,
                status: mockReservationList[0].status,
                startDate: mockReservationList[0].startDate,
                endDate: mockReservationList[0].endDate
            }
        })).to.be.true;
    });

    it("generates an action column that uses the onClickDelete function passed in", () => {
        const deleteSpy = sinon.spy(),
            table = getShallowForm({
                onClickDelete: deleteSpy,
                reservationList: mockReservationList
            }),
            actionCell = table.instance().getActionCell(null, mockReservationList[0]),
            deleteBtn = actionCell.props.children[1];

        deleteBtn.props.onClick();

        expect(deleteSpy.calledWith(mockReservationList[0].id)).to.be.true;
    });
});
