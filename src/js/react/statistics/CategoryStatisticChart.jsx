import React from "react";
import { Chart } from "react-chartjs-2";
import PropTypes from "prop-types";

export class CategoryStatisticChart extends React.Component {
    // Create a number in the array for each category
    get chartData() {
        const array = [],
            nameArray = [];
        for (let i = 0; i < this.props.categoryStatList.length; i++) {
            array[i] = this.props.categoryStatList[i].usage;
            nameArray[i] = this.props.categoryStatList[i].code;
        }
        return [array, nameArray];
    }

    componentDidMount() {
        // Bar chart
        const ctxB = this.props.chart_id;
        this.chart = new Chart(ctxB, {
            type: this.props.chart_type,
            data: {
                labels: this.chartData[1],
                datasets: [{
                    label: "Category Rental %",
                    data: this.chartData[0],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)"
                    ],
                    borderColor: [
                        "rgba(255,99,132,1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 100
                        }
                    }]
                }
            }
        });
        this.handleChartUpdate();
    }

    /* istanbul ignore next */
    handleChartUpdate() {
        // Updates the chart every second, checking for state changes
        setInterval(function() {
            this.chart.data.datasets[0].data = this.chartData[0];
            this.chart.update();
        }.bind(this), 1000);
    }

    render() {
        return (
            <div>
                <canvas
                    height={this.props.categoryStatList.length * 30}
                    id={this.props.chart_id} />
            </div>
        );
    }
};

export default CategoryStatisticChart;

CategoryStatisticChart.propTypes = {
    categoryStatList: PropTypes.array.isRequired,
    chart_id: PropTypes.string.isRequired,
    chart_type: PropTypes.string.isRequired
};
