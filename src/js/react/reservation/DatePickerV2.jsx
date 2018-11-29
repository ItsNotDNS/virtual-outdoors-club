import React from "react";
import PropTypes from "prop-types";
import DayPickerInput from "react-day-picker/DayPickerInput";
import moment from "moment";

export default class DatePickerV2 extends React.Component {
    constructor() {
        super();

        this.onDateChangeWrapper = this.onDateChangeWrapper.bind(this);
        this.getDateRangeOptions = this.getDateRangeOptions.bind(this);
    }
    onDateChangeWrapper(type) {
        return (newDate) => {
            this.props.onDateRangeChange({ [type]: newDate });
        };
    }

    getDisabledView({ startDate, endDate }) {
        return (
            <div>
                <strong className="date-field">
                    {moment(startDate).format("YYYY-MM-DD")}
                </strong>
                {" to "}
                <strong className="date-field">
                    {moment(endDate).format("YYYY-MM-DD")}
                </strong>
            </div>
        );
    }

    getDateRangeOptions() {
        const { allowSelectBeforeToday, allowSelectAfterToday } = this.props,
            before = allowSelectBeforeToday ? null : new Date(),
            after = allowSelectAfterToday ? null : new Date();

        return { before, after };
    }

    getPickerView({ startDate, endDate }) {
        // prevent date selection based on props
        const { before, after } = this.getDateRangeOptions();

        return (
            <div className="row text-center">
                <div className="col-xs-5">
                    <div className="date-right full-width">
                        <DayPickerInput
                            onDayChange={this.onDateChangeWrapper("startDate")}
                            value={startDate}
                            dayPickerProps={{
                                selectedDays: { from: startDate, to: endDate },
                                disabledDays: { before: before, after: endDate }
                            }}
                        />
                    </div>
                </div>
                <div className="col-xs-2">
                    {" to "}
                </div>
                <div className="col-xs-5">
                    <div className="date-left full-width">
                        <DayPickerInput
                            onDayChange={this.onDateChangeWrapper("endDate")}
                            value={this.props.endDate}
                            dayPickerProps={{
                                selectedDays: { from: startDate, to: endDate },
                                disabledDays: { before: startDate, after }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { disabled } = this.props,
            view = disabled ? this.getDisabledView(this.props) : this.getPickerView(this.props);

        return (
            <div className="date-picker-v2 text-center">
                {view}
            </div>
        );
    }
}

DatePickerV2.propTypes = {
    onDateRangeChange: PropTypes.func.isRequired,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    disabled: PropTypes.bool,
    allowSelectBeforeToday: PropTypes.bool,
    allowSelectAfterToday: PropTypes.bool
};
