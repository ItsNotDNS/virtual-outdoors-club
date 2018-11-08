/**
 * Date picker for picking a start date and a end date
 * can set a prop so it shows as horizontal or vertical.
 * Accepts 2 callback function props for the caller to pass in to store the
 * chosen date value.
 * input, output date format: "YYYY-MM-DD"
 */

import React from "react";
import Reflux from "reflux";
import { GearStore } from "../gear/GearStore";
import DayPickerInput from "react-day-picker/DayPickerInput";
import PropTypes from "prop-types";
import { ControlLabel, FormGroup } from "react-bootstrap";
import moment from "moment";

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
            from: undefined,
            to: undefined
        };
    }

    formatDate(date) {
        if (!date) {
            return "";
        }
        const day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
        return (`${year}-${month}-${day}`);
    }

    handleFromChange(from) {
        this.setState({ from });
        this.props.setStartDate(this.formatDate(from));
    }

    handleToChange(to) {
        this.setState({ to });
        this.props.setEndDate(this.formatDate(to));
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

    static getDerivedStateFromProps(props, state) {
        let startDate,
            endDate;
        if (state.from === undefined && state.to === undefined) {
            if (props.startDate) {
                startDate = moment(props.startDate).toDate();
            }
            if (props.endDate) {
                endDate = moment(props.endDate).toDate();
            }
            return ({
                from: startDate,
                to: endDate
            });
        }
        return null;
    }

    render() {
        const { from, to } = this.state;
        return (
            <form>
                <FormGroup>
                    <ControlLabel>Start Date:</ControlLabel>
                    {this.getBR()}
                    <DayPickerInput
                        value={from}
                        placeholder="YYYY-MM-DD"
                        dayPickerProps={{
                            selectedDays: [from, { from, to }],
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
                        value={to}
                        placeholder="YYYY-MM-DD"
                        dayPickerProps={{
                            selectedDays: [from, { from, to }],
                            disabledDays: { before: from },
                            fromMonth: from,
                            month: from
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
    startDate: PropTypes.string,
    endDate: PropTypes.string
};
