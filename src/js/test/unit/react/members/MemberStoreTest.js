import { expect } from "chai";
import sinon from "sinon";
import axiosAuth, { setAxiosWithAuth } from "../../../../constants/axiosConfig";
import { MemberStore } from "react/members/MemberStore";
import MemberService from "services/MemberService";

const sandbox = sinon.createSandbox();
let axiosGetStub, axiosPostStub, axiosDeleteStub, store;

describe("MemberStore Tests", () => {
    beforeEach(() => {
        axiosGetStub = sandbox.stub(axiosAuth.axiosSingleton, "get");
        axiosPostStub = sandbox.stub(axiosAuth.axiosSingleton, "post");
        axiosDeleteStub = sandbox.stub(axiosAuth.axiosSingleton, "delete");
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

    it("fetchBlacklist - sets fetching to true and sets memberList on fetch", () => {
        const response = { data: { data: ["test@example.com"] } };
        axiosGetStub.returns(Promise.resolve(response));

        expect(store.state.fetchingBlacklist).to.be.false;

        store.fetchBlacklist();

        expect(store.state.fetchingBlacklist).to.be.true;
        expect(store.state.blacklist).to.deep.equal([]);

        return store.fetchBlacklist().then(() => {
            expect(store.state.fetchingBlacklist).to.be.false;
            expect(store.state.blacklist).to.deep.equal(response.data.data);
        });
    });

    it("fetchBlacklist - error path and fetching variable", () => {
        const error = { response: { data: { message: "this is an error" } } };
        axiosGetStub.returns(Promise.reject(error));

        expect(store.state.fetchingBlacklist).to.be.false;

        store.fetchBlacklist();

        expect(store.state.fetchingBlacklist).to.be.true;
        expect(store.state.blacklist).to.deep.equal([]);

        return store.fetchMemberList().then(() => {
            expect(store.state.fetchingBlacklist).to.be.false;
            expect(store.state.blacklist).to.deep.equal([]);
            expect(store.state.error).to.equal(error.response.data.message);
        });
    });

    it("fetchBlacklist - bad error response is handled", () => {
        const error = { bad: "error" };
        axiosGetStub.returns(Promise.reject(error));

        return store.fetchBlacklist().then(() => {
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

    it("onAddToBlacklist - success path", () => {
        const member = { email: "someEmail@test.com" },
            response = { data: member };
        store.state.memberList = [member];
        axiosPostStub.returns(Promise.resolve(response));
        return store.onAddToBlacklist(member).then(() => {
            expect(store.state.memberList).to.deep.equal([]);
            expect(store.state.blacklist).to.deep.equal([member]);
        });
    });

    it("onRemoveFromBlacklist - error path", () => {
        const member = { email: "someEmail@test.com" },
            response = { response: { data: { message: "some message" } } };
        store.state.memberList = [member];
        axiosPostStub.returns(Promise.reject(response));
        return store.onAddToBlacklist(member).then(() => {
            expect(store.state.memberList).to.deep.equal([member]);
            expect(store.state.blacklist).to.deep.equal([]);
            expect(store.state.error).to.equal(response.response.data.message);
        });
    });

    it("onRemoveFromBlacklist - success path", () => {
        const member = { email: "someEmail@test.com" };
        store.state.blacklist = [member];
        axiosDeleteStub.returns(Promise.resolve());
        axiosGetStub.returns(Promise.resolve({ data: { data: [member] } }));
        expect(store.state.blacklist).to.deep.equal([member]);
        return store.onRemoveFromBlacklist(member).then(() => {
            expect(store.state.blacklist).to.deep.equal([]);
        });
    });

    it("onAddToBlacklist - error path", () => {
        const member = { email: "someEmail@test.com" },
            response = { response: { data: { message: "some message" } } };
        store.state.memberList = [member];
        axiosDeleteStub.returns(Promise.reject(response));
        return store.onRemoveFromBlacklist(member).then(() => {
            expect(store.state.memberList).to.deep.equal([member]);
            expect(store.state.blacklist).to.deep.equal([]);
            expect(store.state.error).to.equal(response.response.data.message);
        });
    });
});
