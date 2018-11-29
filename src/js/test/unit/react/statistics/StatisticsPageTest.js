import React from "react";
import StatisticPage from "react/statistics/StatisticsPage";
import { StatisticActions } from "react/statistics/StatisticsStore";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import sinon from "sinon";
import Constants from "constants/constants";

const sandbox = sinon.createSandbox();
let actionsStub;

describe("StatisticsPage Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(StatisticActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls fetchedGearStatList on mount", () => {
        const page = shallow(<StatisticPage/>);
        actionsStub.fetchGearStatisticList = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.fetchGearStatisticList.calledOnce).to.be.true;

        page.instance().state.fetchedGearStatList = true; // not set by the component

        page.instance().componentDidMount();

        page.instance().getGearStatChart(); // Chart updates when data received

        expect(actionsStub.fetchGearStatisticList.calledOnce).to.be.true;
    });

    it("calls fetchedCategoryStatList on mount", () => {
        const page = shallow(<StatisticPage/>);
        actionsStub.fetchCategoryStatisticList = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.fetchCategoryStatisticList.calledOnce).to.be.true;

        page.instance().state.fetchedCategoryStatList = true; // not set by the component

        page.instance().componentDidMount();

        page.instance().getCategoryStatChart(); // Chart updates when data received

        expect(actionsStub.fetchCategoryStatisticList.calledOnce).to.be.true;
    });
});
