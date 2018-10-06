import React from "react";
import ReactDOM from "react-dom";

export default class HelloWorld extends React.Component {
    render() {
        return (
            <div>Hello World!!</div>
        );
    }
}

const wrapper = document.getElementById("create-article-form");
wrapper ? ReactDOM.render(<HelloWorld />, wrapper) : false;