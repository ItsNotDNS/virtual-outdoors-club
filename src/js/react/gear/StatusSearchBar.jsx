/**
 * Checkboxes for gear status filtering
 */
import React from "react";
import { Checkbox, FormGroup } from "react-bootstrap";
import Constants from "../../constants/constants";
import PropTypes from "prop-types";

export default class StatusSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.changeValue(event.target.name, event.target.checked);
    };

    render() {
        return (
            <div>
                <FormGroup>
                    <div className="status-search-bar-header"> Gear condition filter: </div>
                    <Checkbox inline name={Constants.gearConditions.RENTABLE}
                        checked={this.props.options.RENTABLE}
                        onChange={this.handleChange}
                    >
                        Rentable
                    </Checkbox>
                    <Checkbox inline name={Constants.gearConditions.FLAGGED}
                        checked={this.props.options.FLAGGED}
                        onChange={this.handleChange}
                    >
                        Flagged
                    </Checkbox>
                    <Checkbox inline name={Constants.gearConditions.NEEDS_REPAIR}
                        checked={this.props.options.NEEDS_REPAIR}
                        onChange={this.handleChange}
                    >
                        Needs Repair
                    </Checkbox>
                    <Checkbox inline name={Constants.gearConditions.DELETED}
                        checked={this.props.options.DELETED}
                        onChange={this.handleChange}
                    >
                        Deleted
                    </Checkbox>
                </FormGroup>
            </div>
        );
    }
}

StatusSearchBar.propTypes = {
    options: PropTypes.object.isRequired,
    changeValue: PropTypes.func.isRequired
};
