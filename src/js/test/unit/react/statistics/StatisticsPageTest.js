import React from "react";
import StatisticPage from "react/statistics/StatisticsPage";
import { StatisticActions } from "react/statistics/StatisticsStore";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import sinon from "sinon";

const sandbox = sinon.createSandbox();
let actionsStub;

describe("StatisticsPage Tests", () => {
    beforeEach(() => {
        actionsStub = sandbox.stub(StatisticActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("calls fetchStatistics on mount", () => {
        const page = shallow(<StatisticPage/>);
        actionsStub.fetchStatistics = sandbox.spy();

        page.instance().componentDidMount();

        expect(actionsStub.fetchStatistics.calledOnce).to.be.true;

        page.instance().state.fetchedStatistics = true; // not set by the component

        page.instance().componentDidMount();

        page.instance().getGearStatChart(); // Chart updates when data received

        expect(actionsStub.fetchStatistics.calledOnce).to.be.true;
    });

    it("displays the charts", () => {
        const page = mount(<StatisticPage/>);
        page.setState({ categoryStatList: [{}] })
        expect(page.find("#CategoryStatChart")).to.have.length(1);
        page.setState({ gearStatList: [{}] })
        expect(page.find("#GearStatChart")).to.have.length(1);
    });
});
