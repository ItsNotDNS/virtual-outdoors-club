import React from "react";
import Page from "react/members/MemberPage";
import { expect } from "chai";
import { mount } from "enzyme";
import sinon from "sinon";
import { MemberActions } from "react/members/MemberStore";

const sandbox = sinon.createSandbox();

describe("MemberPage Tests", () => {
    beforeEach(() => {
        sandbox.stub(MemberActions);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("displays error if upload.error set", () => {
        const page = mount(<Page />);

        page.setState({
            tabSelected: 2
        });
        expect(page.find(".alert-danger")).to.have.length(0);
        page.setState({
            upload: { error: "this is bad", warnings: [], members: [] }
        });
        expect(page.find(".alert-danger")).to.have.length(1);
    });

    it("displays warning if upload.warnings set", () => {
        const page = mount(<Page />);

        page.setState({
            tabSelected: 2
        });
        expect(page.find(".alert-warning")).to.have.length(0);
        page.setState({
            upload: { error: "", warnings: ["row 532 has an issue"], members: [] }
        });
        expect(page.find(".alert-warning")).to.have.length(1);
    });

    it("displays success if upload.members set", () => {
        const page = mount(<Page />);

        page.setState({
            tabSelected: 2
        });
        expect(page.find(".alert-success")).to.have.length(0);
        page.setState({
            upload: { error: "", warnings: [], members: ["test@ualberta.ca"] }
        });
        expect(page.find(".alert-success")).to.have.length(1);
    });
});
