import { expect } from "chai";
import sinon from "sinon";
import axiosAuth, { setAxiosWithAuth } from "../../../../constants/axiosConfig";
import { ReservationStore } from "react/reservation/ReservationStore";
import moment from "moment";
import config from "../../../../../config/config";
import axios from "axios";

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
let axiosGetStub, axiosPostStub, axiosPatchStub, store, axiosStub;

describe("ReservationStore Test", () => {
    beforeEach(() => {
        axiosGetStub = sandbox.stub(axiosAuth.axiosSingleton, "get");
        axiosPostStub = sandbox.stub(axiosAuth.axiosSingleton, "post");
        axiosPatchStub = sandbox.stub(axiosAuth.axiosSingleton, "patch");
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
        };

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
        const dateFormat = "YYYY-MM-DD",
            reservationData = {
                startDate: moment(moment().format(dateFormat), dateFormat).toDate(),
                endDate: moment(moment().format(dateFormat), dateFormat).toDate()
            };

        // Stub getting of Reservation History
        axiosGetStub.returns(Promise.resolve())

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
        ];
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

    it("open closes DisableSystemDialog success", () => {
        expect(store.state.disableSystem.showDialog).to.equal(false);
        store.onOpenDisableSystemDialog();
        expect(store.state.disableSystem.showDialog).to.equal(true);
        store.onCloseDisableSystemDialog();
        expect(store.state.disableSystem.showDialog).to.equal(false);
    });

    it("onEnableSystem - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);
         axiosPostStub.returns(promise); // set stub to return mock data
         return store.onEnableSystem().then(() => {
            expect(store.state.disableSystem.error).to.be.true;
            expect(store.state.disableSystem.errorMessage).to.equal("this is an error message");
        });
    });

    it("onEnableSystem - success path", () => {
        const promise = Promise.resolve({ data: "" });
         axiosPostStub.returns(promise); // set stub to return mock data
         return store.onEnableSystem().then(() => {
            expect(store.state.disableSystem.disableRent).to.equal(false);
        });
    });

    it("onDisableSystem - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);
         axiosPostStub.returns(promise); // set stub to return mock data
         return store.onDisableSystem().then(() => {
            expect(store.state.disableSystem.error).to.be.true;
            expect(store.state.disableSystem.errorMessage).to.equal("this is an error message");
        });
    });

    it("onDisableSystem - success path", () => {
        const promise = Promise.resolve({ data: "" });
         axiosPostStub.returns(promise); // set stub to return mock data
         return store.onDisableSystem().then(() => {
            expect(store.state.disableSystem.disableRent).to.equal(true);
        });
    });

    it("onFetchSystemStatus - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);
         axiosGetStub.returns(promise); // set stub to return mock data
         return store.onFetchSystemStatus().then(() => {
            expect(store.state.disableSystem.fetchError).to.be.true;
            expect(store.state.disableSystem.fetchErrorMessage).to.equal("this is an error message");
        });
    });

    it("onFetchSystemStatus - success path", () => {
        const promise1 = Promise.resolve({ data: [{service: "disableSys", disabled: false}] }),
            promise2 = Promise.resolve({ data: [{service: "disableSys", disabled: true}] });
         axiosGetStub.returns(promise1);
         return store.onFetchSystemStatus().then(() => {
            expect(store.state.disableSystem.disableRent).to.equal(false);
        });
         axiosPostStub.returns(promise2);
         return store.onFetchSystemStatus().then(() => {
            expect(store.state.disableSystem.disableRent).to.equal(true);
        });
    });

    it("onStartReturnProcess", () => {
        store.state.reservationModal.data.gear = [{
            id: 1,
            depositFee: "5.01"
        }, {
            id: 2,
            depositFee: "4.10"
        }]

        store.onStartReturnProcess();

        expect(store.state.returnProcessor).to.have.property("index", 0)
        expect(store.state.returnProcessor).to.have.property("current", store.state.returnProcessor.gear[0])
        expect(store.state.returnProcessor.gear).to.have.length(2)
        expect(store.state.returnProcessor).to.have.property("totalDeposit", "9.11")
    });

    it("onCancelReturnProcess", () => {
        store.state.returnProcessor.index = 2;

        store.onCancelReturnProcess();

        expect(store.state.returnProcessor.index).to.equal(-1);
    })

    it("onChargeChanged", () => {
        const clock = sinon.useFakeTimers(),
            chargeChangedTimeoutStub = sinon.stub(store, "chargeChangedTimeout"),
            timeoutInitValue = store.state.returnProcessor.timeout;

        store.onChargeChanged({ target: { value: "40.01" } } );

        expect(store.state.returnProcessor.timeout).to.not.equal(timeoutInitValue);

        clock.tick(350)

        expect(chargeChangedTimeoutStub.called).to.be.false;
        store.onChargeChanged({ target: { value: "30.01" } } );

        clock.tick(100)

        expect(chargeChangedTimeoutStub.called).to.be.false;

        clock.tick(400)

        expect(chargeChangedTimeoutStub.called).to.be.true;

        clock.restore();
    });

    it("chargeChangedTimeout - sets negative charge to 0", () => {
        store.state.returnProcessor.charge = "-5.0";
        store.state.returnProcessor.totalDeposit = "10.00";

        store.chargeChangedTimeout()

        expect(store.state.returnProcessor.charge).to.equal("0.00");
        expect(store.state.returnProcessor.moneyToReturn).to.equal("10.00")
    });

    it("chargeChangedTimeout - sets text to 0", () => {
        store.state.returnProcessor.charge = "asdfgs";
        store.state.returnProcessor.totalDeposit = "10.00";

        store.chargeChangedTimeout()

        expect(store.state.returnProcessor.charge).to.equal("0.00");
        expect(store.state.returnProcessor.moneyToReturn).to.equal("10.00")
    });

    it("chargeChangedTimeout - overcharge text set to total deposit", () => {
        store.state.returnProcessor.charge = "15.00";
        store.state.returnProcessor.totalDeposit = "10.00";

        store.chargeChangedTimeout()

        expect(store.state.returnProcessor.charge).to.equal("10.00");
        expect(store.state.returnProcessor.moneyToReturn).to.equal("0.00")
    });

    it("onProcessNext - noneNext", () => {
        store.state.returnProcessor.gear = [{1:1}, {2:2}, {3:3}]
        store.state.returnProcessor.index = 2
        store.state.returnProcessor.current = store.state.returnProcessor.gear[2]
        store.state.returnProcessor.current.edit = "test"

        store.onProcessNext()
        expect(store.state.returnProcessor.index).to.equal(3);
        expect(store.state.returnProcessor.current).to.deep.equal({});
        expect(store.state.returnProcessor.gear[2]).to.deep.equal({
            3:3, edit: "test"
        })
    });

    it("onProcessNext - noneNext, setsCharge", () => {
        store.state.returnProcessor.gear = [{depositFee:1}, {depositFee:2, status: "RENTABLE"}, {depositFee:3}]
        store.state.returnProcessor.index = 2
        store.state.returnProcessor.current = store.state.returnProcessor.gear[2]

        store.onProcessNext()
        expect(store.state.returnProcessor.index).to.equal(3);
        expect(store.state.returnProcessor.current).to.deep.equal({});
        expect(store.state.returnProcessor.charge).to.equal("4.00")
    });

    it("onProcessNext - handles going next", () => {
        store.state.returnProcessor.gear = [{1:1}, {2:2}, {3:3}]
        store.state.returnProcessor.index = 1
        store.state.returnProcessor.current = store.state.returnProcessor.gear[1]
        store.state.returnProcessor.current.edit = "test"

        store.onProcessNext()
        expect(store.state.returnProcessor.index).to.equal(2);
        expect(store.state.returnProcessor.current).to.deep.equal({3:3});
        expect(store.state.returnProcessor.gear[1]).to.deep.equal({
            2:2, edit: "test"
        })
    });

    it("onConditionChanged", () => {
        store.onConditionChanged({ label: "", value: "testValue"})
        expect(store.state.returnProcessor.current.status).to.equal("testValue")
    });

    it("onCommentChanged", () => {
        store.state.returnProcessor.current.comment = "hello!"
        store.onCommentChanged();
        expect(store.state.returnProcessor.current.comment).to.equal("hello!")
        store.onCommentChanged({ target: { value: "test" } });
        expect(store.state.returnProcessor.current.comment).to.equal("test")
    });

    it("onFinishProcessing - success path", () => {
        const updateModalAndListStub = sandbox.stub(store, "updateModalAndList")
        store.state.reservationModal.data.id = 1
        store.state.returnProcessor.gear = [{ status: "Good" }]
        store.state.returnProcessor.index = 2
        store.state.returnProcessor.charge = "100.00"

        axiosPostStub.returns(Promise.resolve({ data: "test"}));

        return store.onFinishProcessing().then(() => {
            expect(store.state.returnProcessor.index).to.equal(-1);
            expect(updateModalAndListStub.called).to.be.true;
        });
    });

    it("onFinishProcessing - error path", () => {
        const updateModalAndListStub = sandbox.stub(store, "updateModalAndList")
        store.state.reservationModal.data.id = 1
        store.state.returnProcessor.index = 2
        store.state.returnProcessor.gear = [{ status: "Good" }]
        store.state.returnProcessor.charge = "100.00"

        axiosPostStub.returns(Promise.reject({ response: { data: { message: "error" }}}));

        return store.onFinishProcessing().then(() => {
            expect(store.state.returnProcessor.index).to.equal(2);
            expect(store.state.reservationModal.alertMsg).to.equal("error")
            expect(updateModalAndListStub.called).to.be.false;
        });
    });

    it("onReservationTabSelected changes state properly", () => {
        expect(store.state.reservationModal.tabSelected).to.equal(1);
        axiosGetStub.returns(Promise.resolve());
        store.onReservationModalTabSelected(2);

        expect(store.state.reservationModal.tabSelected).to.equal(2);
    });
});
