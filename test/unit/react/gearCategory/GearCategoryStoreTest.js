import { GearCategoryStore } from "react/gearCategory/GearCategoryStore";
// import Constants from "constants/constants";
// import config from "../../../../src/config/config";
import sinon from "sinon";
import { expect } from "chai";
import axios from "axios";
// import GearService from "../../../../src/js/services/GearService";

let getStub, postStub, patchStub, store = new GearCategoryStore();
const sandbox = sinon.createSandbox(),
    mockCategoryList = [{
        name: "book"
    }, {
        name: "compass"
    }, {
        name: "sleeping bag"
    }, {
        name: "backpack"
    }];

describe("GearCategoryStore Tests", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axios, "get");
        postStub = sandbox.stub(axios, "post");
        patchStub = sandbox.stub(axios, "patch");
    });

    afterEach(() => {
        sandbox.restore();
        store = new GearCategoryStore();
    });

    it("onUpdateDropdown", () => {
        expect(store.state.dropdown.categorySelected).to.equal("");
        const testCategory = mockCategoryList[0].name;
        store.onUpdateDropdown(testCategory);
        expect(store.state.dropdown.categorySelected).to.equal(testCategory);
    });

    it("onFetchGearCategoryList - success path", () => {
        getStub.returns(Promise.resolve({ data: { data: mockCategoryList } }));

        expect(store.state.fetchedGearCategoryList).to.be.false;
        return store.onFetchGearCategoryList().then(() => {
            expect(store.state.fetchedGearCategoryList).to.be.true;
            expect(store.state.categoryList).to.deep.equal(mockCategoryList);
        });
    });
});
