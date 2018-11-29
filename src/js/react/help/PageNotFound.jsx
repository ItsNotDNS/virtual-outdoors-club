import React from "react";

export default class NotFoundPage extends React.Component {
    render() {
        return (
            <div className="not-found-page text-center">
                <h1>Page Not Found!</h1>
                <p>You can find the Outdoors Club's Rental System <a href="/rent">here</a>.</p>
            </div>
        );
    }
}
