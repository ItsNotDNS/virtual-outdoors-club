/**
 * Date picker for picking a start date and a end date
 * can set a prop so it shows as horizontal or vertical.
 * Accepts 2 callback function props for the caller to pass in to store the
 * chosen date value.
 */

import React from "react";
import Reflux from "reflux";
import { GearStore } from "../gear/GearStore";
import DayPickerInput from "react-day-picker/DayPickerInput";
import PropTypes from "prop-types";
import { ControlLabel, FormGroup } from "react-bootstrap";

export default class DateRangePicker extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = GearStore;
        this.endDayPickerInputRef = React.createRef();

        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getBR = this.getBR.bind(this);

        this.state = {
            selectedStartDate: undefined,
            selectedEndDate: undefined
        };
    }

    handleFromChange(from) {
        this.setState({ selectedStartDate: from });
        this.props.setStartDate(from);
    }

    handleToChange(to) {
        this.setState({ selectedEndDate: to });
        this.props.setEndDate(to);
    }

    handleClick() {
        // open the end date picker
        this.endDayPickerInputRef.current.getInput().focus();
    }

    getBR() {
        if (this.props.horizontal) {
            return null;
        }
        return (<br />);
    }

    render() {
        return (
            <form>
                <FormGroup>
                    <ControlLabel>Start Date:</ControlLabel>
                    {this.getBR()}
                    <DayPickerInput
                        value={this.props.startDate || this.state.selectedStartDate}
                        placeholder="YYYY-MM-DD"
                        dayPickerProps={{
                            selectedDays: { from: this.props.startDate || this.state.selectedStartDate, to: this.props.endDate || this.state.selectedEndDate },
                            onDayClick: this.handleClick
                        }}
                        onDayChange={this.handleFromChange}
                    />
                    {this.getBR()}
                    {this.getBR()}
                    <ControlLabel>End Date:</ControlLabel>
                    {this.getBR()}
                    <DayPickerInput
                        ref={this.endDayPickerInputRef}
                        value={this.props.endDate || this.state.selectedEndDate}
                        placeholder="YYYY-MM-DD"
                        dayPickerProps={{
                            selectedDays: {
                                from: this.props.startDate || this.state.selectedStartDate,
                                to: this.props.endDate || this.state.selectedEndDate
                            },
                            disabledDays: { before: this.props.startDate || this.state.selectedStartDate },
                            fromMonth: this.props.startDate || this.state.selectedStartDate,
                            month: this.props.startDate || this.state.selectedStartDate
                        }}
                        onDayChange={this.handleToChange}
                    />
                </FormGroup>
            </form>
        );
    }
};

DateRangePicker.propTypes = {
    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
    horizontal: PropTypes.bool.isRequired,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date)
};
