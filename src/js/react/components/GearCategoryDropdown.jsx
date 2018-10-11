import React from "react";
import PropTypes from "prop-types";
import { Label, Dropdown } from "semantic-ui-react";

export default function GearCategoryDropdown(name) {
    let options = [];

    return (
        <React.Fragment>
            <Label content="Gear Category" />
            <Dropdown selection fluid options={options} name={name} />
        </React.Fragment>
    );
}

PropTypes.GearCategoryDropdown = {
    name: PropTypes.string.isRequired
};
