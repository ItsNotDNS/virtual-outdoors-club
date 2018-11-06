// Takes the top-level react component and attaches it to the DOM.

import React from "react";
import ReactDOM from "react-dom";
import App from "./js/react/App";
import "./scss/main";
import "react-day-picker/lib/style.css";

const contentWrapper = document.getElementById("react-entrypoint");

if (contentWrapper) {
    ReactDOM.render(<App />, contentWrapper);
}
