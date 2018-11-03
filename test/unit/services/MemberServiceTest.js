import MemberService from "services/MemberService";
import { expect } from "chai";
import sinon from "sinon";
import xlsx from "xlsx";

import validFile from "../../mock/excel/members/memberList_valid.xlsx";
import invalidNoTitleFile from "../../mock/excel/members/memberList_no_title.xlsx";
import invalidTwoColsFile from "../../mock/excel/members/memberList_two_email_cols.xlsx";
import invalidTwoSheetsFile from "../../mock/excel/members/memberList_two_sheets.xlsx";
import warningEmailFile from "../../mock/excel/members/memberList_invalid_email.xlsx";

const sandbox = sinon.createSandbox();

describe("MemberService Tests", () => {
    afterEach(() => {
        sandbox.restore();
    });

    it("parseMemberFile - parses then reads buffer", () => {
        const parseFunc = (file) => Promise.resolve({ buffer: file }),
            readBufferFunc = (data) => ({ data }),
            parseStub = sandbox.stub(MemberService.prototype, "_parseFileToBuffer").callsFake(parseFunc),
            bufferStub = sandbox.stub(MemberService.prototype, "_bufferToData").callsFake(readBufferFunc),
            service = new MemberService(),
            file = { fake: "data" };

        service.parseMemberFile(file).then((result) => {
            expect(parseStub.calledOnce).to.be.true;
            expect(bufferStub.calledOnce).to.be.true;
            expect(result).to.deep.equal({
                data: {
                    buffer: {
                        file
                    }
                }
            });
        });
    });

    it("parseFileToBuffer - resolves with file input", () => {
        const fakeFile = new Blob(),
            service = new MemberService();

        return service._parseFileToBuffer(fakeFile)
            .catch(() => {
                expect.fail();
            });
    });

    it("parseFileToBuffer - rejects with invalid input", () => {
        const service = new MemberService();

        return service._parseFileToBuffer(42)
            .then(() => {
                expect.fail();
            })
            .catch((error) => {
                expect(error.toString()).to.equal("Error: Failed to parse the file.");
            });
    });

    it("bufferToData - returns members (no warnings) on success", () => {
        const service = new MemberService(),
            result = service._bufferToData(validFile);

        expect(result.warnings).to.deep.equal([]);
        expect(result.members).to.deep.equal([
            { email: "test@example.com" },
            { email: "me@ualberta.ca" },
            { email: "another@google.ca" }
        ]);
    });

    it("bufferToData - returns members and warnings when they exist", () => {
        const service = new MemberService(),
            result = service._bufferToData(warningEmailFile);

        expect(result.warnings).to.deep.equal([
            "row 4 has an invalid email: 'EMAIL N/A'."
        ]);
        expect(result.members).to.deep.equal([
            { email: "test@example.com" },
            { email: "me@ualberta.ca" }
        ]);
    });

    it("bufferToData - throws if no title", () => {
        const service = new MemberService();

        try {
            service._bufferToData(invalidNoTitleFile);
            expect.fail(); // should have thrown an error
        } catch (e) {
            expect(e.toString()).to.equal("Error: There must be a column with the title 'email'.");
        }
    });

    it("bufferToData - throws if too many titles", () => {
        const service = new MemberService();

        try {
            service._bufferToData(invalidTwoColsFile);
            expect.fail(); // should have thrown an error
        } catch (e) {
            expect(e.toString()).to.equal("Error: There's more than one column that has 'email' in the title.");
        }
    });

    it("bufferToData - throws if too many sheets", () => {
        const service = new MemberService();

        try {
            service._bufferToData(invalidTwoSheetsFile);
            expect.fail(); // should have thrown an error
        } catch (e) {
            expect(e.toString()).to.equal("Error: The uploaded file has 2 sheets. The file must have only 1 sheet.");
        }
    });

    it("bufferToData - throws if xlsx couldn't parse", () => {
        const service = new MemberService();
        sandbox.stub(xlsx, "read").throws("some error");

        try {
            service._bufferToData(validFile);
            expect.fail(); // should have thrown an error
        } catch (e) {
            expect(e.toString()).to.equal("Error: Couldn't parse the file.");
        }
    });
});
