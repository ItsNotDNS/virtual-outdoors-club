import React from "react";
import ReservationModal from "react/reservation/ReservationModal";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";

const {
    REQUESTED,
    APPROVED,
    PAID,
    TAKEN,
    RETURNED,
    CANCELLED
} = Constants.reservations.status,
    sandbox = sinon.createSandbox(),
    getReservation = (status = REQUESTED) => {
        return {
            id: 1,
            email: "someEmail@ualberta.ca",
            licenseName: "MyName Eman",
            licenseAddress: "1234 123St",
            status,
            startDate: new Date(),
            endDate: new Date(),
            gear: [{
                code: "BP01",
                description: "A backpack"
            }]
        };
    },
    getComponent = (props = {}) => {
        const propActions = props.actions || {},
            emptyFunc = () => {},
            actions = {
                approveReservation: propActions.approveReservation || emptyFunc,
                cancelReservation: propActions.cancelReservation || emptyFunc,
                editReservation: propActions.editReservation || emptyFunc,
                loadAvailableGear: propActions.loadAvailableGear || emptyFunc,
                addGearToReservation: propActions.addGearToReservation || emptyFunc,
                saveReservationChanges: propActions.saveReservationChanges || emptyFunc
            };

        return shallow(
            <ReservationModal
                show={props.show || false}
                onClose={props.onClose || emptyFunc}
                actions={actions}
                data={props.data || {}}
                edit={props.edit || {}}
                gearSelect={props.gearSelect || {}}
                tabSelected={props.tabSelected || 1}
                onTabSelected={props.onTabSelected || emptyFunc}
            />
        );
    };

describe("ReservationModal Tests", () => {
    afterEach(() => {
        sandbox.restore();
    });

    it("Overrides data with edit info, if it exists", () => {
        const data = getReservation(),
            edit = {
                startDate: new Date(),
                endDate: new Date(),
                gear: [{
                    code: "BP02",
                    description: "A different backpack"
                }],
                status: APPROVED
            },
            modal = getComponent({ edit, data }),
            componentData = modal.instance().getData();

        // shouldn't have overridden status
        expect(componentData.status).to.equal(REQUESTED);

        // should not be original data
        expect(componentData.startDate).to.not.equal(data.startDate);
        expect(componentData.endDate).to.not.equal(data.endDate);
        expect(componentData.gear).to.not.deep.equal(data.gear);

        // should be edit data instead
        expect(componentData.startDate).to.equal(edit.startDate);
        expect(componentData.endDate).to.equal(edit.endDate);
        expect(componentData.gear).to.deep.equal(edit.gear);
    });

    it("sets canSave depending on edit data", () => {
        const data = getReservation(),
            edit = {},
            modal = getComponent({ edit, data });
        let componentData = modal.instance().getData();

        expect(!!componentData.canSave).to.be.false;
        
        // can just edit the object since it's pass by reference
        edit.endDate = new Date();

        componentData = modal.instance().getData();
        expect(!!componentData.canSave).to.be.true;

        delete edit.endDate;
        edit.gear = [];

        componentData = modal.instance().getData();
        expect(!!componentData.canSave).to.be.true;

        delete edit.gear;
        edit.startDate = new Date();

        componentData = modal.instance().getData();
        expect(!!componentData.canSave).to.be.true;
    });

    it("clickTrash filters out the selected index", () => {
        const editReservationSpy = sandbox.spy(),
            modal = getComponent({ 
            data: getReservation(),
            actions: {
                editReservation: editReservationSpy
            }
        });

        modal.instance().clickTrash(0)(); // is a wrapper function, so need to call twice
        expect(editReservationSpy.calledWith({ gear: [] })).to.be.true;
    });

    it("getGearList returns empty array by default", () => {
        const modal = getComponent({ data: getReservation() }),
            gearListView = modal.instance().getGearList({ editable: true });

        expect(gearListView).to.deep.equal([]);
    });

    it("getGearList no trash symbol and gray if not editable", () => {
        const modal = getComponent({ data: getReservation() });
        let gearListView = modal.instance().getGearList({ 
            gear: [{
                code: "BP01",
                description: "A backpack!"
            }],
            editable: false
        });

        expect(gearListView[0].props.children[4]).to.equal(null);
        
        gearListView = modal.instance().getGearList({ 
            gear: [{
                code: "BP01",
                description: "A backpack!"
            }],
            editable: true
        });

        expect(gearListView[0].props.children[4]).to.not.equal(null);
    });

    it("getModalAlert returns alert if msg", () => {
        const modal = getComponent({ data: getReservation() });
        let alert = modal.instance().getModalAlert("some msg", "danger");
        expect(alert).to.not.equal(undefined);

        alert = modal.instance().getModalAlert();
        expect(alert).to.equal(undefined);

        alert = modal.instance().getModalAlert("some message, default type");
        expect(alert).to.not.equal(undefined);
    });
});
