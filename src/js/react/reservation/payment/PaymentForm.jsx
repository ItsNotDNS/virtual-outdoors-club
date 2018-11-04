import React from "react";
import Reflux from "reflux";
import PropTypes from "prop-types";
import LabeledInput from "../../components/LabeledInput";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { ReservationActions, ReservationStore } from "../ReservationStore";

export default class PaymentForm extends Reflux.Component {
    constructor(props) {
        super(props);

        this.getGearList = this.getGearList.bind(this);
        this.createPayPalForm = this.createPayPalForm.bind(this);

        this.store = ReservationStore;
    }

    componentDidMount() {
        if (!this.state.fetchedPayPalForm) {
            ReservationActions.fetchPayPalForm();
        }
    }

    getGearList() {
        const gearList = [];
        this.props.gear.forEach((gear) => {
            gearList.push(<ListGroupItem key={gear.id} header={gear.code}>{gear.description}</ListGroupItem>);
        });
        return (
            <ListGroup>
                {gearList}
            </ListGroup>
        );
    }

    createPayPalForm() {
        return { __html: this.state.payPalForm };
    }

    render() {
        const title = `Pay for Reservation-${this.props.id.toString()}`;
        return (
            <div className="centre-half">
                <h3>{title}</h3>
                <LabeledInput disabled label="Email" name="email"
                    value={this.props.email} />
                <LabeledInput disabled label="Name" name="name"
                    value={this.props.licenseName} />
                <LabeledInput disabled label="Address" name="address"
                    value={this.props.licenseAddress} />
                <LabeledInput disabled label="Status" name="status"
                    value={this.props.status} />
                <LabeledInput disabled label="Start Date"
                    name="startDate" value={this.props.startDate} />
                <LabeledInput disabled label="End Date" name="endDate"
                    value={this.props.endDate} />

                {this.getGearList()}
                <div className="col-md-4" dangerouslySetInnerHTML={this.createPayPalForm()} />
            </div>
        );
    }
}

PaymentForm.propTypes = {
    id: PropTypes.number,
    email: PropTypes.string,
    licenseName: PropTypes.string,
    licenseAddress: PropTypes.string,
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    gear: PropTypes.array
};
