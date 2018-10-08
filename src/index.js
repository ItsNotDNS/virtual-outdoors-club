// Takes the top-level react component and attaches it to the DOM.

import React from "react";
import ReactDOM from "react-dom";
import App from "./js/react/App";

const wrapper = document.getElementById("react-entrypoint");
if (wrapper) {
    ReactDOM.render(<App />, wrapper);
}
