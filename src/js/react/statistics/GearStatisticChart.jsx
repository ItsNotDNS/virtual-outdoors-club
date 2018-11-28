import React from "react";
import { Chart } from "react-chartjs-2";
import PropTypes from "prop-types";

export class GearStatisticChart extends React.Component {
    // Count the number of gear in each bucket
    get chartData() {
        let col1 = 0, col2 = 0, col3 = 0, col4 = 0, col5 = 0;
        for (let i = 0; i < this.props.gearStatList.length; i++) {
            if (this.props.gearStatList[i].usage < 20) {
                col1++;
            } else if (this.props.gearStatList[i].usage < 40) {
                col2++;
            } else if (this.props.gearStatList[i].usage < 60) {
                col3++;
            } else if (this.props.gearStatList[i].usage < 80) {
                col4++;
            } else if (this.props.gearStatList[i].usage <= 100) {
                col5++;
            }
        }
        return [col1, col2, col3, col4, col5];
    }

    componentDidMount() {
        // Bar chart
        /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "chart" }] */
        const ctxB = this.props.chart_id,
            chart = new Chart(ctxB, {
                type: this.props.chart_type,
                data: {
                    labels: ["Rented <20%", "20 to 40%", "40 to 60%", "60 to 80%", "80 to 100%"],
                    datasets: [{
                        label: "Number of Gear per Bucket",
                        data: this.chartData,
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
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
    }

    render() {
        return (
            <div>
                <canvas id={this.props.chart_id} />
            </div>
        );
    }
};

export default GearStatisticChart;

GearStatisticChart.propTypes = {
    gearStatList: PropTypes.array.isRequired,
    chart_id: PropTypes.string.isRequired,
    chart_type: PropTypes.string.isRequired
};
