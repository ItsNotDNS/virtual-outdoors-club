import { expect } from "chai";
import sinon from "sinon";
import { MemberStore } from "react/members/MemberStore";
import MemberService from "services/MemberService";

const sandbox = sinon.createSandbox();
let store = new MemberStore();

describe("MemberStore Tests", () => {
    afterEach(() => {
        store = new MemberStore();
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
});
