import { StatisticStore } from "react/statistics/StatisticsStore";
import sinon from "sinon";
import { expect } from "chai";
import axiosAuth from "constants/axiosConfig";

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
    mockDateFilterServiceList = {
        "data": {
            "gear": {
                "FP01": {
                    "description": "Frying Pan",
                    "usage": [
                        0.42857142857142855,
                        0.42857142857142855
                    ]
                },
                "CT": {
                    "description": "Coleman Cooktop",
                    "usage": [
                        0.14285714285714285,
                        0.7142857142857143
                    ]
                },
                "T03": {
                    "description": "",
                    "usage": [
                        0.5714285714285714,
                        1.0
                    ]
                },
                "BP12": {
                    "description": "-20 Sleeping Bag, plus some long description string let's see how this fits",
                    "usage": [
                        0.5714285714285714,
                        0.8571428571428571
                    ]
                },
                "MP01": {
                    "description": "Jasper Map",
                    "usage": [
                        0.2857142857142857,
                        0.7142857142857143
                    ]
                }
            },
            "category": {
                "Frying Pan": [
                    0.42857142857142855,
                    0.42857142857142855
                ],
                "Cooktop": [
                    0.14285714285714285,
                    0.7142857142857143
                ],
                "Tarp": [
                    0.5714285714285714,
                    1.0
                ],
                "Backpacks": [
                    0.5714285714285714,
                    0.8571428571428571
                ],
                "Maps": [
                    0.2857142857142857,
                    0.7142857142857143
                ]
            }
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
    mockDateFilterGearStatList = [{
        code: "FP01",
        usage: "42.86",
        description: "Frying Pan"
    }, {
        code: "CT",
        usage: "42.86",
        description: "Coleman Cooktop"
    }, {
        code: "T03",
        usage: "78.57",
        description: ""
    }, {
        code: "BP12",
        usage: "71.43",
        description: "-20 Sleeping Bag, plus some long description string let's see how this fits"
    }, {
        code: "MP01",
        usage: "50.00",
        description: "Jasper Map"
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
    }],
    mockDateFilterCategoryStatList = [{
        code: "Frying Pan",
        usage: "42.86"
    }, {
        code: "Cooktop",
        usage: "42.86"
    }, {
        code: "Tarp",
        usage: "78.57"
    }, {
        code: "Backpacks",
        usage: "71.43"
    }, {
        code: "Maps",
        usage: "50.00"
    }];

describe("StatisticsStore Test", () => {
    beforeEach(() => {
        getStub = sandbox.stub(axiosAuth.axiosSingleton, "get");
    });

    afterEach(() => {
        sandbox.restore();
        statisticsStore = new StatisticStore();
    });

    it("onDateFilterChanged - on success", () => {
        getStub.returns(Promise.resolve({ data: mockDateFilterServiceList }))
        return statisticsStore.onFetchStatistics().then(() => {
            expect(statisticsStore.state.gearStatList).to.deep.equal(mockDateFilterGearStatList)
            expect(statisticsStore.state.categoryStatList).to.deep.equal(mockDateFilterCategoryStatList)
        });
    })

    it("onDateFilterChanged - if error", () => {
        getStub.returns(Promise.reject({ response: { data: { message: "an error!"}}}))
        return statisticsStore.onFetchStatistics().then(() => {
            expect(statisticsStore.state.error).to.contain("an error!")
        });
    })

    it("onDateFilterChanged - if error", () => {
        getStub.returns(Promise.reject({}))
        return statisticsStore.onFetchStatistics().then(() => {
            expect(statisticsStore.state.error).to.contain("try again")
        });
    })

    it("onDateFilterChanged", () => {
        const startDate = new Date(),
            endDate = new Date();

        sandbox.stub(statisticsStore, "onFetchStatistics");

        statisticsStore.onDateFilterChanged({ startDate })
        expect(statisticsStore.state.dateFilter.startDate).to.equal(startDate);
        statisticsStore.onDateFilterChanged({ endDate })
        expect(statisticsStore.state.dateFilter.endDate).to.equal(endDate);
    });
});
