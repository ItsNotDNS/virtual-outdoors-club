import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import {capitalizeFirstLetter} from "../../../react/utilities";

describe("utilities Tests", () => {
    it("capitalizeFirstLetter works", () => {
        expect(capitalizeFirstLetter("")).to.be.null;
        expect(capitalizeFirstLetter(null)).to.be.null;
        expect(capitalizeFirstLetter("ABCD")).to.be.equal("Abcd");
        expect(capitalizeFirstLetter("ABCD EF")).to.be.equal("Abcd ef");
        expect(capitalizeFirstLetter("123")).to.be.equal("123");
    });

});