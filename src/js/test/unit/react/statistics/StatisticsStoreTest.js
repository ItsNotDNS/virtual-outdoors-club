import { StatisticStore, StatisticActions } from "react/statistics/StatisticsStore";
import sinon from "sinon";
import { expect } from "chai";
import axiosAuth from "../../../../constants/axiosConfig";

let getStub, statisticsStore = new StatisticStore();

const sandbox = sinon.createSandbox(),
    mockServiceList = {
        "gear": {
            "FP01": {
                "description": "Frying Pan",
                "usage": [
                    0.42857142857142855
                ]
            },
            "T03": {
                "description": "",
                "usage": [
                    1.0
                ]
            },
            "BP12": {
                "description": "-20 Sleeping Bag, plus some long description string let's see how this fits",
                "usage": [
                    0.87
                ]
            },
        },
        "category": {
            "Frying Pan": [
                0.42857142857142855
            ],
            "Tarp": [
                1.0
            ],
            "Backpacks": [
                0.87
            ],
            "Maps": [
                0.7142857142857143
            ]
        }
    },
    mockGearStatList = [{
        code: "FP01",
        usage: "42.86",
        description: "Frying Pan"
    }, {
        code: "T03",
        usage: "100.00",
        description: ""
    }, {
        code: "BP12",
        usage: "87.00",
        description: "-20 Sleeping Bag, plus some long description string let's see how this fits"
    }],
    mockCategoryStatList = [{
        code: "Frying Pan",
        usage: "42.86"
    }, {
        code: "Tarp",
        usage: "100.00"
    }, {
        code: "Backpacks",
        usage: "87.00"
    }, {
        code: "Maps",
        usage: "71.43"
    }];

describe("StatisticsStore Test", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axiosAuth.axiosSingleton, "get");
    });

    afterEach(() => {
        sandbox.restore();
        statisticsStore = new StatisticStore();
    });

    it ("onFetchGearStatList - success path", () => {
        const promise = Promise.resolve({ data: { data: mockServiceList } });

        expect(statisticsStore.state.fetchedGearStatList).to.be.false;

        getStub.returns(promise);

        return statisticsStore.onFetchGearStatisticList().then(() => {
            expect(statisticsStore.state.fetchedGearStatList).to.be.true;
            expect(statisticsStore.state.error).to.equal("");
            expect(statisticsStore.state.gearStatList).to.deep.equal(mockGearStatList);
        });
    });

    it ("onFetchGearStatList - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);

        expect(statisticsStore.state.fetchedGearStatList).to.be.false;

        getStub.returns(promise); // set stub to return mock data

        return statisticsStore.onFetchGearStatisticList().then(() => {
            expect(statisticsStore.state.fetchedGearStatList).to.be.true;
            expect(statisticsStore.state.error).to.equal(error.response.data.message);
            expect(statisticsStore.state.gearStatList).to.deep.equal([]);
        });
    });

    it ("onFetchCategoryStatList - success path", () => {
        const promise = Promise.resolve({ data: { data: mockServiceList } });

        expect(statisticsStore.state.fetchedCategoryStatList).to.be.false;

        getStub.returns(promise);

        return statisticsStore.onFetchCategoryStatisticList().then(() => {
            expect(statisticsStore.state.fetchedCategoryStatList).to.be.true;
            expect(statisticsStore.state.error).to.equal("");
            expect(statisticsStore.state.categoryStatList).to.deep.equal(mockCategoryStatList);
        });
    });

    it ("onFetchCategoryStatList - error path", () => {
        const error = { response: { data: { message: "this is an error message" } } },
            promise = Promise.reject(error);

        expect(statisticsStore.state.fetchedCategoryStatList).to.be.false;

        getStub.returns(promise); // set stub to return mock data

        return statisticsStore.onFetchCategoryStatisticList().then(() => {
            expect(statisticsStore.state.fetchedCategoryStatList).to.be.true;
            expect(statisticsStore.state.error).to.equal(error.response.data.message);
            expect(statisticsStore.state.categoryStatList).to.deep.equal([]);
        });
    });

    it ("onFetchCategoryStatList - error path", () => {
        const error = { "badError": "noHelp" },
            promise = Promise.reject(error);

        expect(statisticsStore.state.fetchedCategoryStatList).to.be.false;

        getStub.returns(promise); // set stub to return mock data

        return statisticsStore.onFetchCategoryStatisticList().then(() => {
            expect(statisticsStore.state.fetchedCategoryStatList).to.be.true;
            expect(statisticsStore.state.error).to.contain("try again");
            expect(statisticsStore.state.categoryStatList).to.deep.equal([]);
        });
    });
});
