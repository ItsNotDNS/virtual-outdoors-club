import React from "react";
import PropTypes from "prop-types";

export default class GearList extends React.Component {
    render() {
        return this.props.gear.map((item, i) => {
            return (
                <div className="row" key={i}>
                    {item.code}
                </div>
            );
        });
    }
}

GearList.propTypes = {
    gear: PropTypes.array
};
