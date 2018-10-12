import React from "react";
import Alert from "react-bootstrap/lib/Alert";

export default class HelloWorld extends React.Component {
    render() {
        return (
            <div className="poop">
                <Alert bsStyle="warning">
                    <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.
                </Alert>
            </div>
        );
    }
}
