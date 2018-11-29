/**
 * Checkboxes for gear status filtering
 */
import React from "react";
import { Checkbox, FormGroup } from "react-bootstrap";
import { GearActions } from "./GearStore";
import Constants from "../../constants/constants";

export default class StatusSearchBar extends React.Component {
    handleChange(event) {
        GearActions.gearStatusCheckBoxChange(event.target.name, event.target.checked);
    };

    render() {
        return (
            <div>
                <FormGroup>
                    <div className="status-search-bar-header"> Gear condition filter: </div>
                    <Checkbox inline name={Constants.gearConditions.RENTABLE}
                        defaultChecked
                        onClick={this.handleChange}
                    >
                        Rentable
                    </Checkbox>
                    <Checkbox inline name={Constants.gearConditions.FLAGGED}
                        defaultChecked
                        onClick={this.handleChange}
                    >
                        Flagged
                    </Checkbox>
                    <Checkbox inline name={Constants.gearConditions.NEEDS_REPAIR}
                        defaultChecked
                        onClick={this.handleChange}
                    >
                        Needs Repair
                    </Checkbox>
                    <Checkbox inline name={Constants.gearConditions.DELETED}
                        onClick={this.handleChange}
                    >
                        Deleted
                    </Checkbox>
                </FormGroup>
            </div>
        );
    }
}
