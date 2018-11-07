import { expect } from "chai";
import sinon from "sinon";
import axios from "axios";
import { MemberStore } from "react/members/MemberStore";
import MemberService from "services/MemberService";

const sandbox = sinon.createSandbox();
let axiosGetStub, axiosPostStub, store;

describe("MemberStore Tests", () => {
    beforeEach(() => {
        axiosGetStub = sandbox.stub(axios, "get");
        axiosPostStub = sandbox.stub(axios, "post");
        store = new MemberStore({ fetchOnConstruct: false });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("handles tab selection", () => {
        expect(store.state.tabSelected).to.equal(1);
        store.onTabSelected(2);
        expect(store.state.tabSelected).to.equal(2);
    });

    it("onFileSelected - resets upload state, even if no file", () => {
        store.state.upload.error = "this was a bad file";
        store.onFileSelected();
        expect(store.state.upload.error).to.equal("");
    });

    it("onFileSelected - generates error", () => {
        const errMsg = "There was an error parsing the file.",
            reject = Promise.reject(Error(errMsg)),
            parseMemberFileStub = sandbox.stub(MemberService.prototype, "parseMemberFile").returns(reject);

        return store.onFileSelected({ value: "this is a fake" }).then(() => {
            expect(parseMemberFileStub.calledOnce).to.be.true;
            expect(store.state.upload.error).to.equal(`Error: ${errMsg}`);
        });
    });

    it("onFileSelected - success with warnings", () => {
        const members = [{ email: "hello@world.com" }],
            warnings = ["There's an issue on row 2"],
            resolve = Promise.resolve({ members, warnings }),
            parseMemberFileStub = sandbox.stub(MemberService.prototype, "parseMemberFile").returns(resolve);

        return store.onFileSelected({ value: "this value is irrelevant" }).then(() => {
            expect(parseMemberFileStub.calledOnce).to.be.true;
            expect(store.state.upload.members).to.deep.equal(members);
            expect(store.state.upload.warnings).to.deep.equal(warnings);
        });
    });

    it("fetchMemberList - sets fetching to true and sets memberList on fetch", () => {
        const response = { data: { data: ["test@example.com"] } };
        axiosGetStub.returns(Promise.resolve(response));

        expect(store.state.fetchingMemberList).to.be.false;

        store.fetchMemberList();

        expect(store.state.fetchingMemberList).to.be.true;
        expect(store.state.memberList).to.deep.equal([]);

        return store.fetchMemberList().then(() => {
            expect(store.state.fetchingMemberList).to.be.false;
            expect(store.state.memberList).to.deep.equal(response.data.data);
        });
    });

    it("fetchMemberList - error path and fetching variable", () => {
        const error = { response: { data: { message: "this is an error" } } };
        axiosGetStub.returns(Promise.reject(error));

        expect(store.state.fetchingMemberList).to.be.false;

        store.fetchMemberList();

        expect(store.state.fetchingMemberList).to.be.true;
        expect(store.state.memberList).to.deep.equal([]);

        return store.fetchMemberList().then(() => {
            expect(store.state.fetchingMemberList).to.be.false;
            expect(store.state.memberList).to.deep.equal([]);
            expect(store.state.error).to.equal(error.response.data.message);
        });
    });

    it("fetchMemberList - bad error response is handled", () => {
        const error = { bad: "error" };
        axiosGetStub.returns(Promise.reject(error));

        return store.fetchMemberList().then(() => {
            expect(store.state.error).to.not.equal("");
        });
    });

    it("onUploadMemberFile - doesn't call service if no member list", () => {
        expect(store.state.upload.members).to.deep.equal([]);
        expect(axiosPostStub.called).to.be.false;

        const result = store.onUploadMemberFile();

        // still not called
        expect(axiosPostStub.called).to.be.false;
        expect(result).to.equal(undefined);
    });

    it("onUploadMemberFile - success path", () => {
        const memberList = [{
                email: "you@me.com"
            }],
            response = { data: { data: memberList } };

        axiosPostStub.returns(Promise.resolve(response));
        store.state.upload.members = memberList;
        expect(store.state.memberList).to.deep.equal([]);

        return store.onUploadMemberFile().then(() => {
            expect(store.state.upload.error).to.equal("");
            expect(store.state.memberList).to.deep.equal(memberList);
        });
    });

    it("onUploadMemberFile - error path", () => {
        const memberList = [{
                email: "you@me.com"
            }],
            errorMsg = "this is an error",
            response = { response: { data: { message: errorMsg } } };

        axiosPostStub.returns(Promise.reject(response));
        store.state.upload.members = memberList;
        expect(store.state.memberList).to.deep.equal([]);

        return store.onUploadMemberFile().then(() => {
            expect(store.state.upload.error).to.equal(errorMsg);
            expect(store.state.memberList).to.deep.equal([]);
        });
    });
});
