import { expect } from "chai";
import sinon from "sinon";
import axios from "axios";
import { ReservationStore } from "react/reservation/ReservationStore";
import moment from "moment";
import config from "../../../../../config/config";

const sandbox = sinon.createSandbox(),
    mockReservation = {	
        id: 99,	
        email: "email@email.com",	
        licenseName: "Email",	
        licenseAddress: "Email - EmailSt",	
        status: "REQUESTED",	
        startDate: "1970-01-01",	
        endDate: "1970-01-08",	
        gear: []	
    },	
    emptyReservation = {	
        id: null,	
        email: null,	
        licenseName: null,	
        licenseAddress: null,	
        status: null,	
        startDate: null,	
        endDate: null,	
        gear: []	
    };
let axiosGetStub, axiosPostStub, axiosPatchStub, store;

describe("ReservationStore Test", () => {
    beforeEach(() => {
        axiosGetStub = sandbox.stub(axios, "get");
        axiosPostStub = sandbox.stub(axios, "post");
        axiosPatchStub = sandbox.stub(axios, "patch");
        store = new ReservationStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("onLoadAvailableGear - doesn't fetch if !shouldUpdate", () => {
        const startDate = new Date(), endDate = new Date();
        store.state.reservationModal = {
            gearSelect: {
                fetchedStart: moment(startDate).format("YYYY-MM-DD"),
                fetchedEnd: moment(endDate).format("YYYY-MM-DD")
            },
            data: {
                startDate,
                endDate,
                gear: []
            },
            edit: {
                startDate,
                endDate,
                gear: []
            }
        }

        expect(store.onLoadAvailableGear()).to.equal(undefined);

        store.state.reservationModal.edit = {}; // shouldn't matter if edit info is there or not

        expect(store.onLoadAvailableGear()).to.equal(undefined);

        // fundamental concept behind how the function works (string date matching)
        store.state.reservationModal.gearSelect.fetchedStart = "a string that will never match";
        axiosGetStub.returns(Promise.resolve()); // prevent errors from stubbing axios

        store.onLoadAvailableGear();

        expect(store.state.reservationModal.gearSelect.isLoading).to.be.true;
    });

    it("onLoadAvailableGear - sets data after success", () => {
        const startDate = new Date(), endDate = new Date(),
            response = {
                data: { data: [
                    {code: "BP01", category: "Backpack", description: "Red backpack"},
                    {code: "BP02", category: "Backpack", description: "Blue backpack"}
                ]}
            };

        store.state.reservationModal = {
            gearSelect: {
                fetchedStart: "",
                fetchedEnd: ""
            },
            data: {
                startDate,
                endDate,
                gear: [{code: "BP01"}] // should filter this out
            },
            edit: {}
        };

        axiosGetStub.returns(Promise.resolve(response));

        return store.onLoadAvailableGear().then(() => {
            expect(store.state.reservationModal.gearSelect.isLoading).to.be.false;
            expect(store.state.reservationModal.gearSelect.options).to.have.length(1);
        });
    });

    it("onLoadAvailableGear - sets data after success", () => {
        const startDate = new Date(), endDate = new Date(),
            error = {
                response: { data: { message: "an error" } }
            };

        store.state.reservationModal = {
            gearSelect: {
                fetchedStart: "",
                fetchedEnd: "",
                options: []
            },
            data: {
                startDate,
                endDate,
                gear: [{code: "BP01"}]
            },
            edit: {}
        };

        axiosGetStub.returns(Promise.reject(error));

        return store.onLoadAvailableGear().then(() => {
            expect(store.state.reservationModal.gearSelect.isLoading).to.be.false;
            expect(store.state.reservationModal.gearSelect.options).to.have.length(0);
            expect(store.state.reservationModal.alertMsg).to.equal(error.response.data.message);
        });
    });

    it("onAddGearToReservation - removes gear from select, add gear to res.", () => {
        store.state.reservationModal = {
            data: {
                gear: []
            },
            edit: {},
            gearSelect: {
                options: [{
                    label: "BP01 (Backpack) - Red backpack",
                    value: {
                        code: "BP01",
                        category: "Backpack",
                        description: "Red backpack"
                    }
                 }, {
                    label: "BP02 (Backpack) - Blue backpack",
                    value: {
                        code: "BP02",
                        category: "Backpack",
                        description: "Blue backpack"
                    }
                }]
            }
        }

        store.onAddGearToReservation(store.state.reservationModal.gearSelect.options[0]);

        expect(store.state.reservationModal.gearSelect.options).to.have.length(1);
        expect(store.state.reservationModal.edit.gear).to.have.length(1);
    });

    it("onSaveReservationChanges - no service call when no data to update", () => {
        expect(store.onSaveReservationChanges()).to.equal(undefined);

        store.state.reservationModal.edit = {
            endDate: new Date()
        };

        axiosPatchStub.resolves(); // prevent errors with stubbing axios

        expect(store.onSaveReservationChanges()).to.be.instanceOf(Promise);
    });

    it("onSaveReservationChanges - success path", () => {
        store.state.reservationModal.data = {
            gear: [],
            id: 1,
            version: 1
        }
        store.state.reservationModal.edit = {
            gear: [{
                id: 5
            }, {
                id: 6
            }]
        }

        axiosPatchStub.resolves({
            data: {
                id: 1,
                version: 2
            }
        });

        return store.onSaveReservationChanges().then(() => {
            expect(axiosPatchStub.calledWith(`${config.databaseHost}/reservation`, {
                id: store.state.reservationModal.id,
                expectedVersion: store.state.reservationModal.version,
                patch: {
                    gear: [5, 6]
                }
            }));
        })
    });

    it("onOpenReservationModal", () => {
        const reservationData = {
            startDate: new Date(),
            endDate: new Date()
        }

        expect(store.state.reservationModal.show).to.be.false;
        store.onOpenReservationModal(reservationData);
        expect(store.state.reservationModal.show).to.be.true;
        expect(store.state.reservationModal.data).to.deep.equal(reservationData);
    });

    it("onCloseReservationModal", () => {
        store.state.reservationModal.show = true;

        store.onCloseReservationModal();
        expect(store.state.reservationModal.show).to.be.false;
    });

    it("onApproveReservation - success", () => {
        store.state.reservationList = [
            { id: 1, status: "UNAPPROVED" }, { id: 2, status: "CANCELLED" }
        ]
        store.state.reservationModal.data.id = 1;

        axiosPostStub.resolves({ data: {
            id: 1,
            status: "APPROVED"
        }});

        return store.onApproveReservation().then(() => {
            expect(store.state.reservationList).to.deep.equal([{
                id: 1,
                status: "APPROVED"
            }, {
                id: 2,
                status: "CANCELLED"
            }])
        });
    });

    it("onApproveReservation - error", () => {
        axiosPostStub.rejects();

        expect(store.state.reservationModal.alertType).to.equal("")
        return store.onApproveReservation().then(() => {
            expect(store.state.reservationModal.alertType).to.equal("danger")
        });
    });

    it("onApproveReservation - success", () => {
        store.state.reservationList = [
            { id: 1, status: "UNAPPROVED" }, { id: 2, status: "CANCELLED" }
        ]
        store.state.reservationModal.data.id = 1;

        axiosPostStub.resolves({ data: {
            id: 1,
            status: "CANCELLED"
        }});

        return store.onCancelReservation().then(() => {
            expect(store.state.reservationList).to.deep.equal([{
                id: 1,
                status: "CANCELLED"
            }, {
                id: 2,
                status: "CANCELLED"
            }])
        });
    });

    it("onApproveReservation - error", () => {
        axiosPostStub.rejects();

        expect(store.state.reservationModal.alertType).to.equal("")
        return store.onCancelReservation().then(() => {
            expect(store.state.reservationModal.alertType).to.equal("danger")
        });
    });

    it("onEditReservation", () => {
        expect(store.state.reservationModal.edit).to.deep.equal({});

        store.onEditReservation({startDate: new Date()})
        expect(store.state.reservationModal.edit).to.haveOwnProperty("startDate")
        expect(store.state.reservationModal.edit).to.not.haveOwnProperty("endDate")

        store.onEditReservation({endDate: new Date()})
        expect(store.state.reservationModal.edit).to.haveOwnProperty("endDate")

        store.onEditReservation({gear: []})
        expect(store.state.reservationModal.edit).to.haveOwnProperty("gear")
    });

    it("onFetchReservationList - success", () => {
        axiosGetStub.resolves({ data: { data: [{
            data: "test"
        }]}});

        return store.onFetchReservationList().then(() => {
            expect(store.state.reservationList).to.deep.equal([{
                data: "test"
            }]);
        });
    });

    it("onFetchReservationList - success", () => {
        axiosGetStub.rejects({ response: { data: { message: "test" } } });

        return store.onFetchReservationList().then(() => {
            expect(store.state.reservationList).to.deep.equal([]);
            expect(store.state.error).to.not.equal("");
        });
    });


    it("onOpenEmailValidationForm sets the id", () => {	
        expect(store.state.emailValidationForm.id).to.equal(null);	
         store.onOpenEmailValidationForm(1);	
         expect(store.state.emailValidationForm.id).to.equal(1);	
    });

    it("emailValidationFormChanged - email", () => {	
        expect(store.state.emailValidationForm.email).to.equal(null);	
         store.onEmailValidationFormChanged("email", "email@email.com");	
         expect(store.state.emailValidationForm.email).to.equal("email@email.com");	
    });	

    it("onFetchReservation - success path", () => {	
        const promise = Promise.resolve({ data: { data: [mockReservation] } });	
         expect(store.state.reservation).to.deep.equal(emptyReservation);	
         axiosGetStub.returns(promise); // set stub to return mock data	
         return store.onFetchReservation().then(() => {	
            expect(store.state.reservation).to.deep.equal(mockReservation);	
            expect(store.state.error).to.equal("");	
        });	
    });

    it("onFetchReservation - error path", () => {	
        const error = { response: { data: { message: "this is an error message" } } },	
            promise = Promise.reject(error);	
         axiosGetStub.returns(promise); // set stub to return mock data	
         return store.onFetchReservation().then(() => {	
            expect(store.state.reservation).to.deep.equal(emptyReservation);	
            expect(store.state.emailValidationForm.errorMessage).to.equal(error.response.data.message);	
        });	
    });

    it("onFetchPayPalForm - success path", () => {	
        const payPalForm = "Some html string",	
            promise = Promise.resolve({ data: payPalForm });	
         expect(store.state.payPalForm).to.equal(null);	
         axiosPostStub.returns(promise); // set stub to return mock data	
         return store.onFetchPayPalForm().then(() => {	
            expect(store.state.payPalForm).to.equal(payPalForm);	
            expect(store.state.error).to.equal("");	
        });	
    });

    it("onFetchPayPalForm - error path", () => {	
        const error = { response: { data: { message: "this is an error message" } } },	
            promise = Promise.reject(error);	
         axiosPostStub.returns(promise); // set stub to return mock data	
         return store.onFetchPayPalForm().then(() => {	
            expect(store.state.payPalForm).to.equal(null);	
            expect(store.state.error).to.equal(error.response.data.message);	
        });	
    });

    it("onFetchReservationListFromTo", () => {
        axiosGetStub.resolves({
            data: { data: [{ data: "test" }]}
        });

        return store.onFetchReservationListFromTo(() => {
            expect(store.state.reservationList).to.deep.equal([
                {data: "test"}
            ]);
        })
    });

    it("onPayCash - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },	
            promise = Promise.reject(error);	
         axiosPostStub.returns(promise); // set stub to return mock data	
         return store.onPayCash().then(() => {
            expect(store.state.reservationModal.alertMsg).to.equal(error.response.data.message);	
        });	
    });
});
