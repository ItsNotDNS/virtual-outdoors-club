/**
 * Page for viewing gear statistics
 */
import React from "react";
import Reflux from "reflux";
import { StatisticActions, StatisticStore } from "./StatisticsStore";
import ErrorAlert from "../components/ErrorAlert";
import GearStatisticTable from "./GearStatisticTable";
import CategoryStatisticTable from "./CategoryStatisticTable";
import GearStatisticChart from "./GearStatisticChart";
import CategoryStatisticChart from "./CategoryStatisticChart";
import { Tab, Tabs } from "react-bootstrap";
import DateRangePicker from "../reservation/DatePickerV2";

export default class StatisticPage extends Reflux.Component {
    constructor() {
        super();

        this.store = StatisticStore;
    }

    componentDidMount() {
        if (!this.state.fetchedStatistics) {
            StatisticActions.fetchStatistics();
        }
    }

    getGearStatChart() {
        if (this.state.gearStatList.length) {
            return (<GearStatisticChart
                chart_id={"GearStatChart"}
                gearStatList={this.state.gearStatList}
                chart_type={"horizontalBar"}
            />);
        }
    }

    getCategoryStatChart() {
        if (this.state.categoryStatList.length) {
            return (<CategoryStatisticChart
                chart_id={"CategoryStatChart"}
                categoryStatList={this.state.categoryStatList}
                chart_type={"horizontalBar"}
            />);
        }
    }

    getGearTab(tabKey) {
        return (
            <Tab title="Gear Stats" eventKey={tabKey}>
                <div className="row margin-top-2">
                    <div className="col-md-6">
                        <GearStatisticTable
                            gearStatList={this.state.gearStatList}
                        />
                    </div>
                    <div className="col-md-6">
                        { this.getGearStatChart() }
                    </div>
                </div>
            </Tab>);
    }

    getCategoryTab(tabKey) {
        return (
            <Tab title="Category Stats" eventKey={tabKey}>
                <div className="row margin-top-2">
                    <div className="col-md-6">
                        <CategoryStatisticTable
                            gearStatList={this.state.categoryStatList}
                        />
                    </div>
                    <div className="col-md-6">
                        { this.getCategoryStatChart() }
                    </div>
                </div>
            </Tab>);
    }

    render() {
        return (
            <div className="statistics-view">
                <h3>Statistics</h3>
                <p>Here you can view the popularity of gear items and categories.</p>
                <ErrorAlert show={!!this.state.error} errorMessage={this.state.error} />
                <DateRangePicker
                    startDate={this.state.dateFilter.startDate}
                    endDate={this.state.dateFilter.endDate}
                    onDateRangeChange={StatisticActions.dateFilterChanged}
                    allowSelectBeforeToday
                    allowSelectAfterToday={false}
                />
                <Tabs id="accounts-view-tabs">
                    {this.getGearTab(1)}
                    {this.getCategoryTab(2)}
                </Tabs>
            </div>
        );
    }
}
