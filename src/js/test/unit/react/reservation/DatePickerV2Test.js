import React from "react";
import Picker from "react/reservation/DatePickerV2";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import sinon from "sinon";
import DatePickerV2 from "react/reservation/DatePickerV2";

const getPicker = (props = {}) => {
    const emptyFunc = () => {};
    return mount(
        <Picker
            onDateRangeChange={props.onDateRangeChange || emptyFunc}
            startDate={props.startDate}
            endDate={props.endDate}
            disabled={props.disabled}
        />
    );
};

describe("DatePickerV2 Tests", () => {
    it("displays no DayPicker when disabled", () => {
        const picker = getPicker({ disabled: true });

        expect(picker.find(".DayPickerInput")).to.have.length(0);
    });

    it("displays DayPicker when not disabled", () => {
        const picker = getPicker({ disabled: false });

        expect(picker.find(".DayPickerInput")).to.have.length(2);
    });

    it("wraps date change calls", () => {
        const spy = sinon.spy(),
            picker = getPicker({ onDateRangeChange: spy }),
            wrapperFunc = picker.instance().onDateChangeWrapper("aType"),
            someDate = new Date();
        
        expect(spy.called).to.be.false;
        wrapperFunc(someDate)
        expect(spy.calledWith({ "aType": someDate })).to.be.true;
    });

    it("is null on the date range options", () => {
        const picker = shallow(<DatePickerV2
            disabled={false}
            allowSelectBeforeToday={true}
            allowSelectAfterToday={true}
        />);

        expect(picker.find(".DayPickerInput")).to.have.length(0);
    });
});
