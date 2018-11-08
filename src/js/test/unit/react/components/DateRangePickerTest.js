import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import DateRangePicker from "react/components/DateRangePicker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import sinon from "sinon";
import moment from "moment";

describe("DateRangePicker Tests", () => {
    it("formatDate success", () => {
        const formattedDate = "2018-1-23",
            date = new Date("January 23, 2018"),
            setStartDateSpy = sinon.spy(),
            setEndDateSpy = sinon.spy(),
            dateRangePicker = shallow(
                <DateRangePicker
                    setStartDate={setStartDateSpy}
                    setEndDate={setEndDateSpy}
                    horizontal
                    startDate={"2018-10-10"}
                    endDate={"2018-10-14"}
                />
            );
        expect(dateRangePicker.instance().formatDate("")).to.equal("");
        expect(dateRangePicker.instance().formatDate(date)).to.equal(formattedDate);
    });

    it("handleFromChange calls reserveGearFormChanged success", () => {
        const setStartDateSpy = sinon.spy(),
            setEndDateSpy = sinon.spy(),
            mockDate = new Date(),
            dateRangePicker = shallow(
                <DateRangePicker
                    setStartDate={setStartDateSpy}
                    setEndDate={setEndDateSpy}
                    horizontal
                />
            );
        dateRangePicker.instance().handleFromChange(mockDate);
        expect(setStartDateSpy.calledOnce).to.be.true;
    });

    it("handleToChange calls reserveGearFormChanged success", () => {
        const setStartDateSpy = sinon.spy(),
            setEndDateSpy = sinon.spy(),
            mockDate = new Date(),
            dateRangePicker = shallow(
                <DateRangePicker
                    setStartDate={setStartDateSpy}
                    setEndDate={setEndDateSpy}
                    horizontal
                />
            );
        dateRangePicker.instance().handleToChange(mockDate);
        expect(setEndDateSpy.calledOnce).to.be.true;
    });

    it("handleClick opens new date picker", () => {
        const ReactDOM = require("react-dom"),
            setStartDateSpy = sinon.spy(),
            setEndDateSpy = sinon.spy(),
            mockReference = React.createRef(),
            dateRangePicker = shallow(
                <DateRangePicker
                    setStartDate={setStartDateSpy}
                    setEndDate={setEndDateSpy}
                    horizontal
                />
            ),
            mockDatePicker = ReactDOM.render(
                <DayPickerInput ref={mockReference} />, document.getElementsByTagName("BODY")[0]
            );
        dateRangePicker.instance().endDayPickerInputRef = mockReference;
        dateRangePicker.instance().handleClick();
        expect(document.activeElement.parentNode).to.be.equal(ReactDOM.findDOMNode(dateRangePicker.instance().endDayPickerInputRef.current));
    });

    it("get br success", () => {
        const setStartDateSpy = sinon.spy(),
            setEndDateSpy = sinon.spy();
        let dateRangePicker = shallow(
            <DateRangePicker
                setStartDate={setStartDateSpy}
                setEndDate={setEndDateSpy}
                horizontal={false}
            />
        );
        expect(dateRangePicker.instance().getBR().type === "br").to.be.true;
        dateRangePicker = shallow(
            <DateRangePicker
                setStartDate={setStartDateSpy}
                setEndDate={setEndDateSpy}
                horizontal
            />);
        expect(dateRangePicker.instance().getBR()).to.be.null;
    });
});
