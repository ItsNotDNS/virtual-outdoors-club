// Takes the top-level react component and attaches it to the DOM.

import React from "react";
import ReactDOM from "react-dom";
import App from "./js/react/App";
import "react-day-picker/lib/style.css";
import "react-toastify/dist/ReactToastify.css";
import "./scss/main";

const contentWrapper = document.getElementById("react-entrypoint");

if (contentWrapper) {
    ReactDOM.render(<App />, contentWrapper);
}
