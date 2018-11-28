import React from "react";
import Table from "react/reservation/ReservationTable";
import { shallow , mount } from "enzyme";
import { expect } from "chai";
import sinon from "sinon";

describe("ReservationTable Tests", () => {
    it("onSelect a row", () => {
        const funcSpy = sinon.spy(),
            table = shallow(
                <Table onSelectRow={funcSpy}
                    reservationList={[]}
                />),
            onSelect = table.instance().onSelectRow;

        expect(funcSpy.called).to.be.false;
        onSelect();
        expect(funcSpy.called).to.be.true;
    });

    it("formatter formats gear column", () => {
        const table = mount(<Table reservationList={[]} />),
            formatter = table.instance().columns[2].formatter,
            cell = formatter({}, {gear: []})

        expect(cell.props.children).to.equal(0);
    });

    it("formatter formats status column", () => {
        const table = mount(<Table reservationList={[]} />),
            formatter = table.instance().columns[5].formatter,
            cell = formatter("REQUESTED");
        expect(cell).to.equal("Requested");
    });
});
