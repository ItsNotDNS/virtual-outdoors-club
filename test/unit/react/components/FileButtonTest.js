import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import FileButton from "react/components/FileButton";
import sinon from "sinon";

const sandbox = sinon.createSandbox(),
    getShallowButton = (props = {}) => {
        const emptyFunc = () => {};
        return shallow(
            <FileButton
                onFileSelected={props.onFileSelected || emptyFunc}
                placeholder={props.placeholder || "This is a placeholder."}
            />
        );
    };

describe("FileButton Tests", () => {
    afterEach(() => {
        sandbox.restore();
    });

    it("passes click down to input on click", () => {
        const btn = getShallowButton(),
            clickSpy = sinon.spy();
        sandbox.stub(document, "getElementById").withArgs("file-button-hidden-input").returns({ click: clickSpy });

        btn.instance().handleClick();

        expect(clickSpy.calledOnce).to.be.true;
    });

    it("handleFileSelected - sets filename, passes up file", () => {
        const fileChangeSpy = sinon.spy(),
            fakeFile = { value: "fake" },
            btn = getShallowButton({ onFileSelected: fileChangeSpy }),
            fileName = "C://fakePath/my_image.jpg";

        btn.instance().handleFileSelected({
            target: {
                value: fileName,
                files: [fakeFile]
            }
        });
        expect(btn.instance().state.fileName).to.equal("my_image.jpg");
        expect(fileChangeSpy.calledWith(fakeFile)).to.be.true;
    });
});
