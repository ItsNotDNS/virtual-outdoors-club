/**
 * Wrapper for opening file explorer to upload a file
 */
import React from "react";
import PropTypes from "prop-types";

export default class FileButton extends React.Component {
    constructor() {
        super();

        this.handleFileSelected = this.handleFileSelected.bind(this);

        this.state = {
            fileName: ""
        };
    }

    // renders a hidden input that we can use to open the file browser
    getHiddenInput() {
        return (
            <div hidden>
                <input
                    id="file-button-hidden-input"
                    type="file"
                    accept=".xlsx"
                    onChange={this.handleFileSelected}
                />
            </div>
        );
    }

    // Sends the file to a parent function to process.
    handleFileSelected(event) {
        // split and remove the "fake path" from the filename.
        const splitPath = event.target.value.split(/\\|\//),
            fileName = splitPath[splitPath.length - 1];

        this.setState({ fileName });

        this.props.onFileSelected(event.target.files[0]);
    }

    // Pass a click down to the file input
    handleClick() {
        const input = document.getElementById("file-button-hidden-input");
        input && input.click();
    }

    render() {
        const splitFilePath = this.state.fileName.split("\\"),
            fileName = splitFilePath[splitFilePath.length - 1]; // split the file path

        return (
            <div className="file-button" onClick={this.handleClick}>
                <input className="form-control"
                    readOnly
                    type="text"
                    value={fileName}
                    placeholder={this.props.placeholder}
                />
                <button className="btn btn-primary">
                    {this.getHiddenInput()}
                    Choose File
                </button>
            </div>
        );
    }
}

FileButton.propTypes = {
    onFileSelected: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};
