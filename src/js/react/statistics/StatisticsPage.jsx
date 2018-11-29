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

export default class StatisticPage extends Reflux.Component {
    constructor() {
        super();

        this.store = StatisticStore;
    }

    componentDidMount() {
        if (!this.state.fetchedGearStatList) {
            StatisticActions.fetchGearStatisticList();
        }
        if (!this.state.fetchedCategoryStatList) {
            StatisticActions.fetchCategoryStatisticList();
        }
    }

    getGearStatChart() {
        if (this.state.fetchedGearStatList) {
            return (<GearStatisticChart
                chart_id={"GearStatChart"}
                gearStatList={this.state.gearStatList}
                chart_type={"horizontalBar"}
            />);
        }
    }

    getCategoryStatChart() {
        if (this.state.fetchedCategoryStatList) {
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
                <div className="row">
                    <div className="col-md-4">
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
                <div className="row">
                    <div className="col-md-4">
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
            <div className="reservation-view">
                <h3>Statistics</h3>
                <p>Here you can view the popularity of gear items and categories.</p>
                <ErrorAlert show={!!this.state.error} errorMessage={this.state.error} />
                <Tabs id="accounts-view-tabs">
                    {this.getGearTab(1)}
                    {this.getCategoryTab(2)}
                </Tabs>
            </div>
        );
    }
}
