import React from "react";
import Table from "react/members/MemberTable";
import { expect } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";

describe("MemberTable Tests", () => {
    it("wraps click function", () => {
        const emptyfunc = () => {},
            memberList = [
                { email: "test@example.com" }
            ],
            table = shallow(
                <Table
                    memberList={memberList}
                    addToBlackList={emptyfunc}
                />
            ),
            spy = sinon.spy(),
            wrapper = table.instance().wrapOnClick(spy, memberList);

        expect(spy.called).to.be.false;
        wrapper();
        expect(spy.calledWith(memberList)).to.be.true;
    });
});
