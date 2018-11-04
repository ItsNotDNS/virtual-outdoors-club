import React from "react";
import { Checkbox, FormGroup } from "react-bootstrap";
import { GearActions } from "./GearStore";

export default class StatusSearchBar extends React.Component {
    handleChange(event) {
        GearActions.gearStatusCheckBoxChange(event.target.name, event.target.checked);
    };

    render() {
        return (
            <FormGroup>
                <Checkbox inline name="RENTABLE"
                    defaultChecked
                    onClick={this.handleChange}
                >
                        Rentable
                </Checkbox>
                <Checkbox inline name="FLAGGED"
                    defaultChecked
                    onClick={this.handleChange}
                >
                        Flagged
                </Checkbox>
                <Checkbox inline name="NEEDS_REPAIR"
                    defaultChecked
                    onClick={this.handleChange}
                >
                        Needs Repair
                </Checkbox>
                <Checkbox inline name="DELETED"
                    onClick={this.handleChange}
                >
                        Deleted
                </Checkbox>
            </FormGroup>
        );
    }
}
