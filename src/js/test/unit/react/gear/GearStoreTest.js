import { GearStore } from "react/gear/GearStore";
import Constants from "constants/constants";
import config from "../../../../../config/config";
import sinon from "sinon";
import { expect } from "chai";
import axios from "axios";
import GearService from "../../../../services/GearService";
import { GearActions } from "../../../../react/gear/GearStore";

let getStub, postStub, patchStub, deleteStub,
    gearStore = new GearStore();
const sandbox = sinon.createSandbox(),
    mockCategoryList = [{
        name: "book"
    }, {
        name: "compass"
    }, {
        name: "sleeping bag"
    }, {
        name: "backpack"
    }],
    mockGearList = [{
        "id": 1,
        "depositFee": "30.00",
        "code": "BK01",
        "description": "Book about hiking",
        "category": "book",
        "condition": "RENTABLE",
        "version": 1
    }, {
        "id": 2,
        "depositFee": "30.00",
        "code": "BK02",
        "description": "Mountains 101",
        "category": "book",
        "condition": "RENTABLE",
        "version": 3
    }, {
        "id": 3,
        "depositFee": "50.00",
        "code": "TN01",
        "description": "Tent for 4 people",
        "category": "tent",
        "condition": "RENTABLE",
        "version": 1
    }],
    mockReservationInfo = { "email": "henry@email.com",
        "licenseName": "Name on their license.",
        "licenseAddress": "Address on their license.",
        "startDate": "2018-10-25",
        "endDate": "2018-10-28",
        "items": [{
            "id": 0,
            "description": "Deuter 60+10 Blue (New Oct 2017)"
        }, {
            "id": 2,
            "description": "GT01 - Jasper and Malgine Lake - 1:100,000 - Tyvek"
        }] },
    mockReservationList = [
        {
            id: 1,
            email: "email1",
            licenseAddress: "address1",
            licenseName: "name1",
            startDate: "2018-11-01",
            endDate: "2018-11-03",
            gear: [mockGearList[0]],
            status: "REQUESTED"
        },
        {
            id: 2,
            email: "email2",
            licenseAddress: "address2",
            licenseName: "name2",
            startDate: "2018-11-09",
            endDate: "2018-11-11",
            gear: [mockGearList[0], mockGearList[1]],
            status: "REQUESTED"
        }
    ];

describe("GearStore Tests", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axios, "get");
        postStub = sandbox.stub(axios, "post");
        patchStub = sandbox.stub(axios, "patch");
        deleteStub = sandbox.stub(axios, "delete");
    });

    afterEach(() => {
        sandbox.restore();
        gearStore = new GearStore();
    });

    it("onUpdateDropdown", () => {
        expect(gearStore.state.categoryDropdown.categorySelected).to.equal("");
        const testCategory = mockCategoryList[0].name;
        gearStore.onUpdateDropdown(testCategory);
        expect(gearStore.state.categoryDropdown.categorySelected).to.equal(testCategory);
    });

    it("onFetchGearList - success path", () => {
        const promise = Promise.resolve({ data: { data: mockGearList } });

        expect(gearStore.state.fetchedGearList).to.be.false;

        getStub.returns(promise); // set stub to return mock data

        return gearStore.onFetchGearList().then(() => {
            expect(gearStore.state.fetchedGearList).to.be.true;
            expect(gearStore.state.gearList).to.deep.equal(mockGearList);
            expect(gearStore.state.error).to.equal("");
        });
    });

    it("onFetchGearList - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);

        expect(gearStore.state.fetchedGearList).to.be.false;

        getStub.returns(promise); // set stub to return mock data

        return gearStore.onFetchGearList().then(() => {
            expect(gearStore.state.fetchedGearList).to.be.true;
            expect(gearStore.state.gearList).to.deep.equal([]);
            expect(gearStore.state.error).to.equal(error.response.data.message);
        });
    });

    it("onFetchGearList - error path without a response from server", () => {
        const error = {},
            promise = Promise.reject(error);

        expect(gearStore.state.fetchedGearList).to.be.false;

        getStub.returns(promise); // set stub to return mock data

        return gearStore.onFetchGearList().then(() => {
            expect(gearStore.state.fetchedGearList).to.be.true;
            expect(gearStore.state.gearList).to.deep.equal([]);
            expect(gearStore.state.error).to.contain("server is down");
        });
    });

    it("onOpenGearModal - open and close CREATE path", () => {
        // initial state
        expect(gearStore.state.gearModal).to.deep.equal({
            show: false,
            error: false,
            errorMessage: "",
            mode: null,
            id: null,
            expectedVersion: null,
            gearCode: "",
            depositFee: "",
            gearCategory: "",
            gearDescription: ""
        });

        gearStore.onOpenGearModal();

        // show should be true and mode should be CREATING
        expect(gearStore.state.gearModal).to.deep.equal({
            show: true,
            error: false,
            errorMessage: "",
            mode: Constants.modals.CREATING,
            id: null,
            expectedVersion: null,
            gearCode: "",
            depositFee: "",
            gearCategory: "",
            gearDescription: ""
        });

        gearStore.onCloseGearModal();

        // returns to base state
        expect(gearStore.state.gearModal).to.deep.equal({
            show: false,
            error: false,
            errorMessage: "",
            mode: null,
            id: null,
            expectedVersion: null,
            gearCode: "",
            depositFee: "",
            gearCategory: "",
            gearDescription: ""
        });
    });

    it("onGearModalChanged - all fields update", () => {
        expect(gearStore.state.gearModal.gearCode).to.equal("");
        gearStore.onGearModalChanged("gearCode", mockGearList[0].code);
        expect(gearStore.state.gearModal.gearCode).to.equal(mockGearList[0].code);

        expect(gearStore.state.gearModal.depositFee).to.equal("");
        gearStore.onGearModalChanged("depositFee", mockGearList[0].depositFee);
        expect(gearStore.state.gearModal.depositFee).to.equal(mockGearList[0].depositFee);

        expect(gearStore.state.gearModal.gearCategory).to.equal("");
        gearStore.onGearModalChanged("gearCategory", mockGearList[0].category);
        expect(gearStore.state.gearModal.gearCategory).to.equal(mockGearList[0].category);

        expect(gearStore.state.gearModal.gearDescription).to.equal("");
        gearStore.onGearModalChanged("gearDescription", mockGearList[0].description);
        expect(gearStore.state.gearModal.gearDescription).to.equal(mockGearList[0].description);
    });

    it("onSubmitGearModal - prevents submission if category is not selected", () => {
        gearStore.onSubmitGearModal();

        expect(gearStore.state.gearModal.error).to.be.true;
        expect(gearStore.state.gearModal.errorMessage).to.equal("You need to select a category.");
    });

    it("onSubmitGearModal - CREATE - success path", () => {
        const mockGear = mockGearList[1];
        gearStore.onOpenGearModal(); // open gearModal for creating
        gearStore.onGearModalChanged("gearCode", mockGear.code);
        gearStore.onGearModalChanged("depositFee", mockGear.depositFee);
        gearStore.onGearModalChanged("gearCategory", mockGear.category);
        gearStore.onGearModalChanged("gearDescription", mockGear.description);

        postStub.returns(Promise.resolve({ data: mockGear }));

        return gearStore.onSubmitGearModal().then(() => {
            expect(postStub.calledWith(`${config}/gear`, {
                code: mockGear.code,
                depositFee: mockGear.depositFee,
                category: mockGear.category,
                description: mockGear.description
            }));
            expect(gearStore.state.gearModal.show).to.be.false;
            expect(gearStore.state.gearList).to.deep.equal([mockGear]);
        });
    });

    it("onSubmitGearModal - CREATE - error path", () => {
        const mockGear = mockGearList[1],
            error = { response: { data: { message: "this is an error message" } } };
        gearStore.onOpenGearModal(); // open gearModal for creating
        gearStore.onGearModalChanged("gearCategory", mockGear.category);

        postStub.returns(Promise.reject(error));

        return gearStore.onSubmitGearModal().then(() => {
            expect(gearStore.state.gearModal.error).to.be.true;
            expect(gearStore.state.gearModal.errorMessage).to.equal(error.response.data.message);
        });
    });

    it("onSubmitGearModal - EDIT - success path", () => {
        const mockGear = mockGearList[2],
            mockGearResponse = JSON.parse(JSON.stringify(mockGear)); // cloning method

        // modify our expectation
        mockGearResponse.version += 1;
        mockGearResponse.description = "this is a new gear description";

        // set the gear list up with our mock data
        gearStore.state.gearList = mockGearList;

        // open the modal editor with EDIT mode
        gearStore.onOpenGearModal(Constants.modals.EDITING, {
            gear: {
                id: mockGear.id,
                expectedVersion: mockGear.version,
                gearCode: mockGear.code,
                depositFee: mockGear.depositFee,
                gearCategory: mockGear.category,
                gearDescription: mockGear.description
            }
        });

        // ensure we cloned properly, the state does not match the new values
        expect(gearStore.state.gearModal.id).to.equal(mockGearResponse.id);
        expect(gearStore.state.gearModal.gearDescription).to.not.equal(mockGearResponse.description);

        // update the state with our new values
        gearStore.onGearModalChanged("gearDescription", mockGearResponse.description);
        expect(gearStore.state.gearModal.gearDescription).to.equal(mockGearResponse.description);

        // should return this response
        patchStub.returns(Promise.resolve({ data: mockGearResponse }));

        // check that index 2 matches the current object
        expect(gearStore.state.gearList[2]).to.deep.equal(mockGear);
        return gearStore.onSubmitGearModal().then(() => {
            // gearList should be updated
            expect(gearStore.state.gearList[2]).to.deep.equal(mockGearResponse);
        });
    });

    it("onSubmitGearModal - EDIT - error path", () => {
        const mockGear = mockGearList[2],
            mockGearResponse = JSON.parse(JSON.stringify(mockGear)), // cloning method
            error = { response: { data: { message: "this is an error message" } } };

        // modify our expectation
        mockGearResponse.version += 1;
        mockGearResponse.description = "this is a new gear description";

        // set the gear list up with our mock data
        gearStore.state.gearList = mockGearList;

        // open the modal editor with EDIT mode
        gearStore.onOpenGearModal(Constants.modals.EDITING, {
            gear: {
                id: mockGear.id,
                expectedVersion: mockGear.version,
                gearCode: mockGear.code,
                depositFee: mockGear.depositFee,
                gearCategory: mockGear.category,
                gearDescription: mockGear.description
            }
        });

        patchStub.returns(Promise.reject(error));

        return gearStore.onSubmitGearModal().then(() => {
            expect(gearStore.state.gearModal.error).to.be.true;
            expect(gearStore.state.gearModal.errorMessage).to.equal(error.response.data.message);
        });
    });

    it("onFetchGearCategoryList - success", () => {
        getStub.returns(Promise.resolve({ data: { data: mockCategoryList } }));

        expect(gearStore.state.categoryList).to.deep.equal([]);
        expect(gearStore.state.fetchedGearCategoryList).to.be.false;

        return gearStore.onFetchGearCategoryList().then(() => {
            expect(gearStore.state.categoryList).to.deep.equal(mockCategoryList);
            expect(gearStore.state.fetchedGearCategoryList).to.be.true;
        });
    });

    it("onFetchGearCategoryList - error", () => {
        const error = { response: { data: { message: "this is an error message" } } };
        getStub.returns(Promise.reject(error));

        expect(gearStore.state.categoryList).to.deep.equal([]);
        expect(gearStore.state.fetchedGearCategoryList).to.be.false;

        return gearStore.onFetchGearCategoryList().then(() => {
            expect(gearStore.state.categoryList).to.deep.equal([]);
            expect(gearStore.state.fetchedGearCategoryList).to.be.true;
            expect(gearStore.state.error).to.equal(error.response.data.message);
        });
    });

    it("onFetchGearCategoryList - error without server response", () => {
        const error = {};
        getStub.returns(Promise.reject(error));

        expect(gearStore.state.categoryList).to.deep.equal([]);
        expect(gearStore.state.fetchedGearCategoryList).to.be.false;

        return gearStore.onFetchGearCategoryList().then(() => {
            expect(gearStore.state.categoryList).to.deep.equal([]);
            expect(gearStore.state.fetchedGearCategoryList).to.be.true;
            expect(gearStore.state.error).to.contain("server is down");
        });
    });

    it("onOpenCategoryModal - create mode by default", () => {
        expect(gearStore.state.categoryModal.show).to.be.false;
        expect(gearStore.state.categoryModal.mode).to.equal(null);

        gearStore.onOpenCategoryModal();

        expect(gearStore.state.categoryModal.show).to.be.true;
        expect(gearStore.state.categoryModal.mode).to.equal(Constants.modals.CREATING);
    });

    it("onOpenCategoryModal - editing", () => {
        expect(gearStore.state.categoryModal.show).to.be.false;
        expect(gearStore.state.categoryModal.mode).to.equal(null);

        gearStore.onOpenCategoryModal(Constants.modals.EDITING, { category: mockCategoryList[0] });

        expect(gearStore.state.categoryModal.show).to.be.true;
        expect(gearStore.state.categoryModal.mode).to.equal(Constants.modals.EDITING);
        expect(gearStore.state.categoryModal.originalName).to.equal(mockCategoryList[0].name);
        expect(gearStore.state.categoryModal.category).to.equal(mockCategoryList[0].name);
    });

    it("categoryModalChanged - category", () => {
        expect(gearStore.state.categoryModal.category).to.equal("");

        gearStore.categoryModalChanged("category", "a new name");

        expect(gearStore.state.categoryModal.category).to.equal("a new name");
    });

    it("onSubmitCategoryModal - prevent blank category", () => {
        expect(gearStore.state.categoryModal.category).to.equal("");
        gearStore.onSubmitCategoryModal();

        expect(gearStore.state.categoryModal.error).to.be.true;
        expect(gearStore.state.categoryModal.errorMessage).to.equal("You cannot leave the category name blank.");
    });

    it("onSubmitCategoryModal - create - success", () => {
        gearStore.onOpenCategoryModal();
        gearStore.categoryModalChanged("category", mockCategoryList[1].name);

        postStub.returns(Promise.resolve({ data: mockCategoryList[0] }));

        return gearStore.onSubmitCategoryModal().then(() => {
            expect(gearStore.state.categoryModal.show).to.be.false;
            expect(gearStore.state.categoryList).to.deep.equal([mockCategoryList[0]]);
        });
    });

    it("onSubmitCategoryModal - create - error", () => {
        const error = { response: { data: { message: "this is an error message" } } };
        gearStore.onOpenCategoryModal();
        gearStore.categoryModalChanged("category", mockCategoryList[1].name);

        postStub.returns(Promise.reject(error));

        return gearStore.onSubmitCategoryModal().then(() => {
            expect(gearStore.state.categoryModal.show).to.be.true;
            expect(gearStore.state.categoryList).to.deep.equal([]);
            expect(gearStore.state.categoryModal.error).to.be.true;
            expect(gearStore.state.categoryModal.errorMessage).to.equal(error.response.data.message);
        });
    });

    it("onSubmitCategoryModal - edit - success", () => {
        const newCategoryName = "this new name",
            expectedResponse = JSON.parse(JSON.stringify(mockCategoryList)); // clone object

        expectedResponse[1].name = newCategoryName; // set expected response

        gearStore.state.categoryList = mockCategoryList; // set category list
        gearStore.onOpenCategoryModal(Constants.modals.EDITING, { category: mockCategoryList[1] });

        gearStore.categoryModalChanged("category", newCategoryName);

        patchStub.returns(Promise.resolve({ data: { name: newCategoryName } }));
        getStub.returns(Promise.resolve({ data: { data: mockGearList } })); // also gets the gear list again

        return gearStore.onSubmitCategoryModal().then(() => {
            expect(patchStub.calledWith(`${config.databaseHost}/gear/categories`, {
                name: mockCategoryList[1].name,
                patch: {
                    name: newCategoryName
                }
            })).to.be.true;
            expect(gearStore.state.gearList).to.deep.equal(mockGearList);
            expect(gearStore.state.categoryList).to.deep.equal(expectedResponse);
        });
    });

    it("onSubmitCategoryModal - edit - error", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            newCategoryName = "this new name",
            expectedResponse = JSON.parse(JSON.stringify(mockCategoryList)); // clone object

        expectedResponse[1].name = newCategoryName; // set expected response

        gearStore.state.categoryList = mockCategoryList; // set category list
        gearStore.onOpenCategoryModal(Constants.modals.EDITING, { category: mockCategoryList[1] });

        gearStore.categoryModalChanged("category", newCategoryName);

        patchStub.returns(Promise.reject(error));

        return gearStore.onSubmitCategoryModal().then(() => {
            expect(patchStub.calledWith(`${config.databaseHost}/gear/categories`, {
                name: mockCategoryList[1].name,
                patch: {
                    name: newCategoryName
                }
            })).to.be.true;
            expect(gearStore.state.categoryModal.error).to.be.true;
            expect(gearStore.state.categoryModal.errorMessage).to.equal(error.response.data.message);
            expect(gearStore.state.categoryModal.show).to.be.true;
        });
    });

    it("onAddToShoppingCart success", () => {
        const mockGear = mockGearList[0];
        gearStore.onAddToShoppingCart(mockGear);
        expect(gearStore.state.shoppingList.length).to.equal(1);
        // gear already in the list should not be added
        gearStore.onAddToShoppingCart(mockGear);
        expect(gearStore.state.shoppingList.length).to.equal(1);
    });

    it("onRemoveToShoppingCart success", () => {
        expect(gearStore.state.checkoutDisabled).to.be.true;
        gearStore.onAddToShoppingCart(mockGearList[0]);
        gearStore.onAddToShoppingCart(mockGearList[1]);
        expect(gearStore.state.checkoutDisabled).to.be.false;
        expect(gearStore.state.shoppingList.length).to.equal(2);
        gearStore.onRemoveFromShoppingCart(mockGearList[0]);
        expect(gearStore.state.checkoutDisabled).to.be.false;
        expect(gearStore.state.shoppingList.length).to.equal(1);
        gearStore.onRemoveFromShoppingCart(mockGearList[1]);
        expect(gearStore.state.checkoutDisabled).to.be.true;
        expect(gearStore.state.shoppingList.length).to.equal(0);
    });

    it("onOpenDeleteGearModal", () => {
        expect(gearStore.state.deleteGearModal.show).to.be.false;

        gearStore.onOpenDeleteGearModal(mockGearList[0].id);

        expect(gearStore.state.deleteGearModal.show).to.be.true;
        expect(gearStore.state.deleteGearModal.id).to.equal(mockGearList[0].id);
    });

    it("onSubmitDeleteGearModal - success path", () => {
        const expectedGearList = mockGearList;
        expectedGearList[0].condition = "DELETED"
        // set the gear list up with our mock data
        gearStore.state.gearList = mockGearList;
        gearStore.state.deleteGearModal.id = mockGearList[0].id;
        deleteStub.returns(Promise.resolve({ data: "Success" }));

        return gearStore.onSubmitDeleteGearModal().then(() => {
            expect(deleteStub.calledWith(`${config.databaseHost}/gear`, {
                params: {
                    id: mockGearList[0].id
                }
            })).to.be.true;
            expect(gearStore.state.gearList).to.deep.equal(expectedGearList);
        });
    });

    it("onSubmitDeleteGearModal - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } };
        gearStore.state.deleteGearModal.id = mockGearList[0].id;
        deleteStub.returns(Promise.reject(error));

        return gearStore.onSubmitDeleteGearModal().then(() => {
            expect(gearStore.state.deleteGearModal.error).to.be.true;
            expect(gearStore.state.deleteGearModal.errorMessage).to.equal(error.response.data.message);
        });
    });

    it("onOpenDeleteGearCategoryModal", () => {
        expect(gearStore.state.deleteGearCategoryModal.show).to.be.false;

        gearStore.onOpenDeleteGearCategoryModal(mockCategoryList[0].name);

        expect(gearStore.state.deleteGearCategoryModal.show).to.be.true;
        expect(gearStore.state.deleteGearCategoryModal.name).to.equal(mockCategoryList[0].name);
    });

    it("onSubmitDeleteGearCategoryModal - success path", () => {
        const expectedCategoryList = JSON.parse(JSON.stringify(mockCategoryList));
        expectedCategoryList.shift();
        // set the gear list up with our mock data
        gearStore.state.categoryList = mockCategoryList;
        gearStore.state.deleteGearCategoryModal.name = mockCategoryList[0].name;
        deleteStub.returns(Promise.resolve({ data: "Success" }));

        return gearStore.onSubmitDeleteGearCategoryModal().then(() => {
            expect(deleteStub.calledWith(`${config.databaseHost}/gear/categories`, {
                params: {
                    name: mockCategoryList[0].name
                }
            })).to.be.true;
            expect(gearStore.state.categoryList).to.deep.equal(expectedCategoryList);
        });
    });

    it("onSubmitDeleteGearCategoryModal - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } };
        gearStore.state.deleteGearCategoryModal.name = mockCategoryList[0].name;
        deleteStub.returns(Promise.reject(error));

        return gearStore.onSubmitDeleteGearCategoryModal().then(() => {
            expect(gearStore.state.deleteGearCategoryModal.error).to.be.true;
            expect(gearStore.state.deleteGearCategoryModal.errorMessage).to.equal(error.response.data.message);
        });
    });

    // tests for reservation
    it("Reserve Gear Form - open and close", () => {
        // initial state
        expect(gearStore.state.reserveGearForm).to.deep.equal({
            show: false,
            error: false,
            errorMessage: "Reservation failed",
            items: [],
            email: "",
            licenseName: "",
            licenseAddress: "",
            startDate: null,
            endDate: null
        });

        gearStore.onOpenReserveGearForm();

        // should not open because shopping list is empty
        expect(gearStore.state.reserveGearForm).to.deep.equal({
            show: false,
            error: false,
            errorMessage: "Reservation failed",
            items: [],
            email: "",
            licenseName: "",
            licenseAddress: "",
            startDate: null,
            endDate: null
        });

        gearStore.state.shoppingList.push(mockGearList[0]);
        gearStore.onOpenReserveGearForm();
        expect(gearStore.state.reserveGearForm).to.deep.equal({
            show: true,
            error: false,
            errorMessage: "Reservation failed",
            items: [],
            email: "",
            licenseName: "",
            licenseAddress: "",
            startDate: null,
            endDate: null
        });

        gearStore.onCloseReserveGearForm();

        // returns to base state
        expect(gearStore.state.reserveGearForm).to.deep.equal({
            show: false,
            error: false,
            errorMessage: "Reservation failed",
            items: [],
            email: "",
            licenseName: "",
            licenseAddress: "",
            startDate: null,
            endDate: null
        });
    });

    it("onReserveGearFormChanged - all fields update", () => {
        expect(gearStore.state.reserveGearForm.email).to.equal("");
        gearStore.onReserveGearFormChanged("email", mockReservationInfo.email);
        expect(gearStore.state.reserveGearForm.email).to.equal(mockReservationInfo.email);

        expect(gearStore.state.reserveGearForm.licenseName).to.equal("");
        gearStore.onReserveGearFormChanged("licenseName", mockReservationInfo.licenseName);
        expect(gearStore.state.reserveGearForm.licenseName).to.equal(mockReservationInfo.licenseName);

        expect(gearStore.state.reserveGearForm.licenseAddress).to.equal("");
        gearStore.onReserveGearFormChanged("licenseAddress", mockReservationInfo.licenseAddress);
        expect(gearStore.state.reserveGearForm.licenseAddress).to.equal(mockReservationInfo.licenseAddress);

        expect(gearStore.state.reserveGearForm.startDate).to.equal(null);
        gearStore.onReserveGearFormChanged("startDate", mockReservationInfo.startDate);
        expect(gearStore.state.reserveGearForm.startDate).to.equal(mockReservationInfo.startDate);

        expect(gearStore.state.reserveGearForm.endDate).to.equal(null);
        gearStore.onReserveGearFormChanged("endDate", mockReservationInfo.endDate);
        expect(gearStore.state.reserveGearForm.endDate).to.equal(mockReservationInfo.endDate);
    });

    it("onSubmitReserveGearForm - success path", () => {
        gearStore.state.shoppingList.push(mockGearList[0]);
        gearStore.onOpenReserveGearForm();
        postStub.returns(Promise.resolve({}));
        return gearStore.onSubmitReserveGearForm().then(() => {
            expect(gearStore.state.reserveGearForm.error).to.be.false;
            expect(gearStore.state.reserveGearForm.show).to.be.false;
            expect(gearStore.state.shoppingList.length).to.be.equals(0);
        });
    });

    it("onSubmitReserveGearForm - error path", () => {
        const error = { response: { data: { message: "Error message" } } };
        gearStore.state.shoppingList.push(mockGearList[0]);
        gearStore.onOpenReserveGearForm();
        postStub.returns(Promise.reject(error));
        return gearStore.onSubmitReserveGearForm().then(() => {
            expect(gearStore.state.reserveGearForm.error).to.be.true;
            expect(gearStore.state.reserveGearForm.show).to.be.true;
        });
    });

    it("onFileSelected - resets upload state if no file", () => {
        gearStore.state.upload.error = "This is an error";
        gearStore.onFileSelected();
        expect(gearStore.state.upload.error).to.equal("");
    });

    it("onFileSelected - success path", () => {
        const response = {
                gear: [{
                    gearCode: "HL01",
                    depositFee: 50,
                    gearDescription: "Petzl Black",
                    gearCategory: "headlamp"
                }],
                categories: [
                    "headlamp"
                ]
            },
            promise = Promise.resolve(response);

        sandbox.stub(GearService.prototype, "parseGearFile").returns(promise);

        return gearStore.onFileSelected({ fake: "data" }).then(() => {
            expect(gearStore.state.upload.gear).to.deep.equal(response.gear);
            expect(gearStore.state.upload.categories).to.deep.equal(response.categories);
        });
    });

    it("onFileSelected - error path", () => {
        const errorMsg = "This is an error message",
            error = new Error(errorMsg),
            promise = Promise.reject(error);

        sandbox.stub(GearService.prototype, "parseGearFile").returns(promise);

        return gearStore.onFileSelected({ fake: "data" }).then(() => {
            expect(gearStore.state.upload.error).to.equal(error.toString());
        });
    });

    it("onUploadGearFile - returns a list of failed", () => {
        const createGearStub = sandbox.stub(GearService.prototype, "createGear"),
            gearList = [{
                gearCode: "HL01",
                depositFee: 50,
                gearDescription: "Petzl Black",
                gearCategory: "headlamp"
            }, {
                gearCode: "HL02",
                depositFee: 49.99,
                gearDescription: "Petzl Yellow Green",
                gearCategory: "headlamp"
            }];
        sandbox.stub(GearService.prototype, "createCategory").returns(Promise.resolve());
        sandbox.stub(GearActions, "fetchGearList");
        sandbox.stub(GearActions, "fetchGearCategoryList");
        createGearStub.withArgs(gearList[0]).returns(Promise.resolve({}));
        createGearStub.withArgs(gearList[1]).returns(Promise.resolve({ error: "some error" }));

        gearStore.state.upload.gear = gearList;
        gearStore.state.upload.categories = ["headlamp"];

        return gearStore.onUploadGearFile().then(() => {
            expect(gearStore.state.upload.results.show).to.be.true;
            expect(gearStore.state.upload.results.failed).to.deep.equal(["HL02"]);
        });
    });

    it("status checkbox unchecked then checked", () => {
        const mockCheckboxOptions = {
            RENTABLE: true,
            FLAGGED: true,
            NEEDS_REPAIR: true,
            DELETED: false
        }
        expect(gearStore.state.checkboxOptions).to.deep.equal(mockCheckboxOptions);
        gearStore.onGearStatusCheckBoxChange(mockCheckboxOptions[0], false);
        expect(gearStore.state.checkboxOptions[mockCheckboxOptions[0]]).to.be.false;
        gearStore.onGearStatusCheckBoxChange(mockCheckboxOptions[0], true);
        expect(gearStore.state.checkboxOptions[mockCheckboxOptions[0]]).to.be.true;
    });

    it("onDateFilterChanged success", () => {
        const mockStartDate = "2018-01-01",
            mockEndDate = "2018-01-02";
        expect(gearStore.state.dateFilter.startDate).to.equal(null);
        expect(gearStore.state.dateFilter.endDate).to.equal(null);
        gearStore.onDateFilterChanged("startDate", mockStartDate);
        expect(gearStore.state.dateFilter.startDate).to.equal(mockStartDate);
        gearStore.onDateFilterChanged("endDate", mockEndDate);
        expect(gearStore.state.dateFilter.endDate).to.equal(mockEndDate);
    });

    it("onFetchGearListFromTo - success", () => {
        const mockStartDate = "2018-01-01",
            mockEndDate = "2018-01-02";
        getStub.returns(Promise.resolve({ data: { data: mockGearList } }));
        gearStore.onFetchGearListFromTo(mockStartDate, mockEndDate);
        return gearStore.onFetchGearListFromTo(mockStartDate, mockEndDate).then(() => {
            expect(gearStore.state.gearList).to.be.equal(mockGearList);
        });
    });

    it("onFetchGearListFromTo - error", () => {
        const mockStartDate = "2018-01-01",
            mockEndDate = "2018-01-02",
            error = { response: { data: { message: "Error message" } } };
        getStub.returns(Promise.reject(error));
        gearStore.onFetchGearListFromTo(mockEndDate, mockStartDate);
        return gearStore.onFetchGearListFromTo(mockEndDate, mockStartDate).then(() => {
            expect(gearStore.state.gearList.length).to.be.equal(0);
        });
    });
});
