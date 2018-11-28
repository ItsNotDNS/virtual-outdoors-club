/**
 * Form to show the user detailed information about their reservation
 */
import React from "react";
import Reflux from "reflux";
import PropTypes from "prop-types";
import LabeledInput from "../../components/LabeledInput";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { ReservationActions, ReservationStore } from "../ReservationStore";
import payPalLogo from "../../../images/PayPal_logo_logotype_emblem.png";

// This needs to be a Reflux component and not a redux component
// Because it needs to monitor the store for changes
export default class PaymentForm extends Reflux.Component {
    constructor(props) {
        super(props);

        this.getGearList = this.getGearList.bind(this);
        this.getPayPalLink = this.getPayPalLink.bind(this);

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

    getPayPalLink() {
        return (
            this.state.error
                ? <div className="text-center">
                    <div>
                        {this.state.error}
                    </div>
                    <div className="col-md-4 col-md-offset-4 text-center disabled-div">
                        Authorize with PayPal
                    </div>
                </div>
                : this.state.payPalForm
                    ? <a href={this.state.payPalForm}>
                        <div className="col-md-4 col-md-offset-4 text-center paypal-div">
                            Authorize with
                            {" "}
                            <img className="paypal-logo" src={payPalLogo} alt="PayPal" />
                        </div>
                    </a>
                    : "Loading..."
        );
    }

    render() {
        const title = `Reservation #${this.props.id.toString()} Information`;
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
                {this.getPayPalLink()}
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
