import React from "react";
import Page from "react/members/MemberPage";
import { expect } from "chai";
import { mount } from "enzyme";
import sinon from "sinon";
import { MemberActions, MemberStore } from "react/members/MemberStore";

const sandbox = sinon.createSandbox();

describe("MemberPage Tests", () => {
    beforeEach(() => {
        sandbox.stub(MemberActions);

        // stub MemberStore to prevent network calls
        sandbox.stub(MemberStore.prototype, "fetchMemberList");
        sandbox.stub(MemberStore.prototype, "fetchBlacklist");
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

    it("displays info if upload.members set", () => {
        const page = mount(<Page />);

        page.setState({
            tabSelected: 2
        });
        expect(page.find(".alert-info")).to.have.length(0);
        page.setState({
            upload: { error: "", warnings: [], members: ["test@ualberta.ca"] }
        });
        expect(page.find(".alert-info")).to.have.length(1);
    });

    it("displays success if upload.displaySuccess set", () => {
        const page = mount(<Page />);

        page.setState({
            tabSelected: 2
        });
        expect(page.find(".alert-success")).to.have.length(0);
        page.setState({
            upload: { error: "", warnings: [], members: [], displaySuccess: true }
        });
        expect(page.find(".alert-success")).to.have.length(1);
    });

    it("member list: displays loading, no members, or table depending on state", () => {
        const page = mount(<Page />);

        page.setState({
            fetchingMemberList: false,
            fetchedMemberList: false,
            memberList: []
        });

        expect(page.find(".member-loading-message")).to.have.length(0);
        expect(page.find(".no-members-message")).to.have.length(0);
        expect(page.find("table")).to.have.length(0);

        page.setState({
            fetchingMemberList: true,
            fetchedMemberList: false,
            memberList: []
        });

        expect(page.find(".member-loading-message"), "should find message").to.have.length(1);
        expect(page.find(".no-members-message"), "shouldn't find no-members").to.have.length(0);
        expect(page.find("table"), "shouldn't find table").to.have.length(0);

        page.setState({
            fetchingMemberList: false,
            fetchedMemberList: true,
            memberList: []
        });

        expect(page.find(".member-loading-message")).to.have.length(0);
        expect(page.find(".no-members-message")).to.have.length(1);
        expect(page.find("table")).to.have.length(0);

        page.setState({
            fetchingMemberList: false,
            fetchedMemberList: true,
            memberList: [{ email: "example@test.com" }]
        });

        expect(page.find(".member-loading-message")).to.have.length(0);
        expect(page.find(".no-members-message")).to.have.length(0);
        expect(page.find("table")).to.have.length(1);
    });

    it("blacklist list: displays loading, no members, or table depending on state", () => {
        const page = mount(<Page />);

        page.setState({
            tabSelected: 2,
            fetchingBlacklist: false,
            fetchedBlacklist: false,
            blacklist: []
        });

        expect(page.find(".blacklist-loading-message")).to.have.length(0);
        expect(page.find(".no-blacklist-message")).to.have.length(0);
        expect(page.find("table")).to.have.length(0);

        page.setState({
            fetchingBlacklist: true,
            fetchedBlacklist: false,
            blacklist: []
        });

        expect(page.find(".blacklist-loading-message"), "should find message").to.have.length(1);
        expect(page.find(".no-blacklist-message"), "shouldn't find no-members").to.have.length(0);
        expect(page.find("table"), "shouldn't find table").to.have.length(0);

        page.setState({
            fetchingBlacklist: false,
            fetchedBlacklist: true,
            blacklist: []
        });

        expect(page.find(".blacklist-loading-message")).to.have.length(0);
        expect(page.find(".no-blacklist-message")).to.have.length(1);
        expect(page.find("table")).to.have.length(0);

        page.setState({
            fetchingBlacklist: false,
            fetchedBlacklist: true,
            blacklist: [{ email: "example@test.com" }]
        });

        expect(page.find(".blacklist-loading-message")).to.have.length(0);
        expect(page.find(".no-blacklist-message")).to.have.length(0);
        expect(page.find("table")).to.have.length(1);
    });
});
