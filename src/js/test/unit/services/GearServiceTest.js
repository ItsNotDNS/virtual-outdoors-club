// these tests are to test file reading

import GearService from "services/GearService";
import { expect } from "chai";
import sinon from "sinon";
import xlsx from "xlsx";

import validFile from "../../mock/excel/gear/gearList_valid.xlsx";
import warningMissingData from "../../mock/excel/gear/gearList_missing_data.xlsx";
import invalidMissingColumn from "../../mock/excel/gear/gearList_missing_title.xlsx";
import invalidDuplicateTitle from "../../mock/excel/gear/gearList_duplicate_title.xlsx";
import invalidTwoSheets from "../../mock/excel/gear/gearList_multiple_sheets.xlsx";

const sandbox = sinon.createSandbox();

describe("GearService Tests", () => {
    afterEach(() => {
        sandbox.restore();
    });

    it("parseMemberFile - parses then reads buffer", () => {
        const parseFunc = (file) => Promise.resolve({ buffer: file }),
            readBufferFunc = (data) => ({ data }),
            parseStub = sandbox.stub(GearService.prototype, "_parseFileToBuffer").callsFake(parseFunc),
            bufferStub = sandbox.stub(GearService.prototype, "_bufferToData").callsFake(readBufferFunc),
            service = new GearService(),
            file = { fake: "data" };

        return service.parseGearFile(file).then((result) => {
            expect(parseStub.calledOnce).to.be.true;
            expect(bufferStub.calledOnce).to.be.true;
            expect(result).to.deep.equal({
                data: {
                    buffer: file
                }
            });
        });
    });

    it("parseFileToBuffer - resolves with file input", () => {
        const fakeFile = new Blob(),
            service = new GearService();

        return service._parseFileToBuffer(fakeFile)
            .catch(() => {
                expect.fail();
            });
    });

    it("parseFileToBuffer - rejects with invalid input", () => {
        const service = new GearService();

        return service._parseFileToBuffer(42)
            .then(() => {
                expect.fail();
            })
            .catch((error) => {
                expect(error.toString()).to.equal("Error: Failed to parse the file.");
            });
    });

    it("bufferToData - returns gear, categories (no warnings) on success", () => {
        const service = new GearService(),
            result = service._bufferToData(validFile);

        expect(result.categories).to.deep.equal([
            "headlamp",
            "hiking pole"
        ]);
        expect(result.gear).to.deep.equal([{
            gearCode: "HL01",
            depositFee: 50,
            gearDescription: "Petzl Black",
            gearCategory: "headlamp"
        }, {
            gearCode: "HL02",
            depositFee: 49.99,
            gearDescription: "Petzl Yellow Green",
            gearCategory: "headlamp"
        }, {
            gearCode: "HP01",
            depositFee: 51.01,
            gearDescription: "Red Komperdell Trailmaster",
            gearCategory: "hiking pole"
        }, {
            gearCode: "HP02",
            depositFee: 50,
            gearDescription: "Red Komperdell Trailmaster",
            gearCategory: "hiking pole"
        }]);
        expect(result.warnings).to.deep.equal([]);
    });

    it("bufferToData - returns gear, categories and warnings when they exist", () => {
        const service = new GearService(),
            result = service._bufferToData(warningMissingData);

        expect(result.warnings).to.deep.equal([
            "Row 3 has missing data.",
            "Row 4 has missing data."
        ]);
        expect(result.categories).to.deep.equal([
            "headlamp",
            "hiking pole"
        ]);
        expect(result.gear).to.deep.equal([{
            gearCode: "HL01",
            depositFee: 50,
            gearDescription: "Petzl Yellow Green",
            gearCategory: "headlamp"
        }, {
            gearCode: "HP02",
            depositFee: 50,
            gearDescription: "Red Komperdell Trailmaster",
            gearCategory: "hiking pole"
        }]);
    });

    it("bufferToData - throws if no title", () => {
        const service = new GearService();

        try {
            service._bufferToData(invalidMissingColumn);
            expect.fail(); // should have thrown an error
        } catch (e) {
            expect(e.toString()).to.equal("Error: There must be a column with the title 'category'.");
        }
    });

    it("bufferToData - throws if duplicate titles", () => {
        const service = new GearService();

        try {
            service._bufferToData(invalidDuplicateTitle);
            expect.fail(); // should have thrown an error
        } catch (e) {
            expect(e.toString()).to.equal("Error: There's more than one column that has 'category' in the title.");
        }
    });

    it("bufferToData - throws if too many sheets", () => {
        const service = new GearService();

        try {
            service._bufferToData(invalidTwoSheets);
            expect.fail(); // should have thrown an error
        } catch (e) {
            expect(e.toString()).to.equal("Error: The uploaded file has 2 sheets. The file must have only 1 sheet.");
        }
    });

    it("bufferToData - throws if xlsx couldn't parse", () => {
        const service = new GearService();
        sandbox.stub(xlsx, "read").throws("some error");

        try {
            service._bufferToData(validFile);
            expect.fail(); // should have thrown an error
        } catch (e) {
            expect(e.toString()).to.equal("Error: Couldn't parse the file.");
        }
    });
});
