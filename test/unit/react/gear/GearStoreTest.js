import { GearStore } from "react/gear/GearStore";
import Constants from "constants/constants";
import config from "../../../../src/config/config";
import sinon from "sinon";
import { expect } from "chai";
import axios from "axios";

let getStub, postStub, patchStub, gearStore = new GearStore();
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
        "version": 1
    }, {
        "id": 2,
        "depositFee": "30.00",
        "code": "BK02",
        "description": "Mountains 101",
        "category": "book",
        "version": 3
    }, {
        "id": 3,
        "depositFee": "50.00",
        "code": "TN01",
        "description": "Tent for 4 people",
        "category": "tent",
        "version": 1
    }];

describe("GearStore Tests", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axios, "get");
        postStub = sandbox.stub(axios, "post");
        patchStub = sandbox.stub(axios, "patch");
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
});
