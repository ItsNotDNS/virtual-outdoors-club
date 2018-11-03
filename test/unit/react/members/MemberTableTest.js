import React from "react";
import Table from "react/members/MemberTable";
import { expect } from "chai";
import { shallow } from "enzyme";

describe("MemberTable Tests", () => {
    it("renders", () => {
        const memberList = [
                { email: "test@example.com" }
            ],
            table = shallow(<Table memberList={memberList} />);

        expect(table.getElement().type.name).to.equal("BootstrapTableContainer");
    });
});
