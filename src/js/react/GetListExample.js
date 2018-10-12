import React from 'react';
import ReactDOM from "react-dom";

const regeneratorRuntime = require("regenerator-runtime");

// check if the connection works with CORS Header
export default class GearList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gear: []
        }
    }

    // sample API request to get gear list to Django server (port 8000)
    async componentDidMount() {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/get-gear-list');
            const gear = await res.json();
            console.log("JSON", gear)
            this.setState({
                gear
            });
        } catch (e) {
            console.log(e);
        }
    }

    // display
    render() {
        return (
            <div>
                {this.state.gear.map(item => (
                    <div key={item.pk}>
                        <h1>{item.fields.gearID}</h1>
                        <span>{item.fields.depositFee}</span>
                    </div>
                ))}
            </div>
        );
    }
}
const wrapper = document.getElementById("create-article-form");
wrapper ? ReactDOM.render(<GearList />, wrapper) : false;