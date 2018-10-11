import React from "react";
import Reflux from "reflux";
import { GearStore, GearActions } from "./GearStore";
import { Button } from "semantic-ui-react";

export default class GearPage extends Reflux.Component {
    constructor() {
        super();

        this.store = GearStore;
    }
    render() {
        return (
            <div onClick={GearActions.fetchGearList}>
                Hello I am a gear page: {JSON.stringify(this.state.gearList)}}
                <Button content="I am button" />
            </div>
        );
    }
};
