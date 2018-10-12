import { GearStore, GearActions } from "react/gear/GearStore";
import GearService from "services/GearService";
import sinon from "sinon";
import { expect } from "chai";

const sandbox = sinon.createSandbox();
let message = "";

describe("GearStore Tests", () => {
    afterEach(() => {
        sandbox.restore();
        GearActions.reset();
    });

    it("onFetchGearList - sets fetchedGearList true, sets grabbed data on promise.resolve", () => {
        const data = [{ "key": "value" }],
            serviceStub = sandbox.stub(GearService.prototype, "fetchGearList")
                .returns(Promise.resolve(data));

        message = "The inital state of the store should have error:false";
        expect(GearStore.state.error, message).to.be.false;
        message = "The inital state of the store should have fetchedGearList:false";
        expect(GearStore.state.fetchedGearList, message).to.be.false;
        message = "The inital state of the store have no gearList data";
        expect(GearStore.state.gearList, message).to.deep.equal([]);

        // run the function we're testing
        GearActions.fetchGearList();

        message = "After fetching store should have fetchedGearList:true";
        expect(GearStore.state.fetchedGearList, message).to.be.true;
        message = "fetchGearList should only be called once";
        expect(serviceStub.calledOnce, message).to.be.true;

        // promise test structure allows us to resolve promises and then test the results
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    message = "The store should update the gearList after recieving data";
                    expect(GearStore.state.gearList, message).to.deep.equal(data);
                    message = "The post state of the store should have error:false";
                    expect(GearStore.state.error, message).to.be.false;
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }, 1);
        });
    });

    it("onFetchGearList - promise.reject is handled", () => {
        const error = { error: 404 },
            serviceStub = sandbox.stub(GearService.prototype, "fetchGearList")
                .returns(Promise.reject(error));

        message = "The inital state of the store should have fetchedGearList:false";
        expect(GearStore.state.fetchedGearList, message).to.be.false;
        message = "The inital state of the store should have error:false";
        expect(GearStore.state.fetchedGearList, message).to.be.false;

        // run the function we're testing
        GearActions.fetchGearList();

        message = "After fetching store should have fetchedGearList:true";
        expect(GearStore.state.fetchedGearList, message).to.be.true;
        message = "fetchGearList should only be called once";
        expect(serviceStub.calledOnce, message).to.be.true;

        // promise test structure allows us to resolve promises and then test the results
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    message = "The store should update the error state after an error";
                    expect(GearStore.state.error, message).to.deep.equal(error);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }, 1);
        });
    });
});
