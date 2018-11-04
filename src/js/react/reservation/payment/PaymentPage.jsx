import React from "react";
import Reflux from "reflux";
import { ReservationActions, ReservationStore } from "../ReservationStore";
import * as queryString from "query-string";
import PaymentForm from "./PaymentForm";
import EmailValidationForm from "./EmailValidationForm";

export default class PaymentPage extends Reflux.Component {
    constructor(props) {
        super(props);

        this.store = ReservationStore;
    }

    componentDidMount() {
        const params = queryString.parse(this.props.location.search);
        ReservationActions.openEmailValidationForm(parseInt(params.id));
    }

    getComponent() {
        if (this.state.reservation.id) {
            return <PaymentForm {...this.state.reservation} />;
        } else {
            return (
                <EmailValidationForm
                    onChange={ReservationActions.emailValidationFormChanged}
                    onSubmit={ReservationActions.fetchReservation}
                    {...this.state.emailValidationForm}
                />
            );
        }
    }

    render() {
        return (
            this.getComponent()
        );
    }
}
