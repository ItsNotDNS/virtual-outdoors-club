import React from "react";
import Reflux from "reflux";
import { ReservationStore, ReservationActions } from "./ReservationStore";
import Select from "react-select";
import constants from "../../constants/constants";

const {
    conditions: {
        RENTABLE,
        FLAGGED,
        NEEDS_REPAIR
    },
    conditionLabels: {
        LOOKS_GOOD,
        BROKEN,
        NEEDS_CHECK,
        MISSING
    }
} = constants.gear;

export default class ReturnProcessor extends Reflux.Component {
    constructor() {
        super();

        this.store = ReservationStore;

        this.getInformation = this.getInformation.bind(this);
    }

    getProcessStartButton() {
        return (
            <div className="row">
                <div className="col-md-4 col-xs-2" />
                <div className="col-md-4 col-xs-8">
                    <button onClick={ReservationActions.startReturnProcess}
                        className="full-width btn btn-primary"
                    >
                        Return Gear
                    </button>
                </div>
            </div>
        );
    }

    getOptions({ disableBack, showProcess }) {
        const nextButton = showProcess
            ? (
                <button onClick={ReservationActions.finishProcessing}
                    className="full-width btn btn-success"
                >
                    Process
                </button>
            ) : (
                <button onClick={ReservationActions.processNext}
                    className="full-width btn btn-primary"
                >
                    Next
                </button>
            );

        return (
            <div className="row">
                <hr />
                <div className="col-xs-4">
                    <button onClick={ReservationActions.processPrevious}
                        disabled={disableBack}
                        className="full-width btn btn-primary"
                    >
                        Back
                    </button>
                </div>
                <div className="col-xs-4">
                    <button onClick={ReservationActions.cancelReturnProcess}
                        className="full-width btn btn-danger"
                    >
                        Cancel
                    </button>
                </div>
                <div className="col-xs-4">
                    {nextButton}
                </div>
            </div>
        );
    }

    getGearLockWarning() {
        return (
            <div className="row bottom-margin text-danger">
                <div className="col-xs-12">
                    <i className="fa fa-exclamation-triangle" /> If you choose to report this condition, members will be unable to rent or checkout this gear until an admin resolves the status.
                </div>
            </div>
        );
    }

    getInformation() {
        const { index, current: { status, comment } } = this.state.returnProcessor,
            { code } = this.state.reservationModal.data.gear[index],
            options = [
                { label: LOOKS_GOOD, value: RENTABLE },
                { label: BROKEN, value: NEEDS_REPAIR },
                { label: NEEDS_CHECK, value: FLAGGED },
                { label: MISSING, value: MISSING }
            ],
            selected = options.filter((option) => option.value === status);

        return (
            <div className="text-left">
                <div className="row bottom-margin">
                    <div className="col-xs-12">
                        <h4>{`What's the condition of ${code}?`}</h4>
                    </div>
                </div>
                <div className="row bottom-margin">
                    <div className="col-xs-12">
                        <strong>{"Current Condition: "}</strong>
                        <Select menuPlacement="top"
                            value={selected}
                            onChange={ReservationActions.conditionChanged}
                            options={options}
                        />
                    </div>
                </div>
                {status !== "RENTABLE" ? this.getGearLockWarning() : null}
                <div className="row bottom-margin">
                    <div className="col-xs-12">
                        <strong>{"Comment (optional): "}</strong>
                        <input className="form-control"
                            value={comment}
                            onChange={ReservationActions.commentChanged}
                            type="text"
                            placeholder={"Any comments about the gear?"}
                        />
                    </div>
                </div>
            </div>
        );
    }

    getReceiptWarning() {
        return (
            <div className="row bottom-margin text-danger">
                <div className="col-xs-12">
                    <i className="fa fa-exclamation-triangle" /> You should keep track of any cash you take with receipts and signatures. Prepare the amount of the deposit you are returning before clicking "Process".
                </div>
            </div>
        );
    }

    getAccountingRow(label, value, editable) {
        return (
            <div className="row bottom-margin text-left">
                <div className="col-md-2 col-xs-2">
                    {label}
                </div>
                <div className="col-md-2 col-xs-4">
                    <input disabled={!editable}
                        className="full-width text-right"
                        type="text" value={value}
                        onChange={ReservationActions.chargeChanged}
                    />
                </div>
            </div>
        );
    }

    getConfirmation(wasCashPayment, { totalDeposit, charge, moneyToReturn }) {
        const paymentType = wasCashPayment ? "cash" : "PayPal";

        return (
            <div className="text-left">
                {wasCashPayment ? this.getReceiptWarning() : null}
                <div className="row bottom-margin">
                    <div className="col-xs-12">
                        <strong>This reservation's deposit was made via {paymentType}.</strong>
                    </div>
                </div>
                {this.getAccountingRow("Deposit:", totalDeposit, false)}
                {this.getAccountingRow("Charge (editable):", charge, true)}
                {this.getAccountingRow("To Return:", moneyToReturn, false)}
            </div>
        );
    }

    render() {
        const { index } = this.state.returnProcessor,
            { gear, payment } = this.state.reservationModal.data,
            cashPayment = payment === "CASH";

        if (index === -1) {
            return this.getProcessStartButton();
        } else if (index < gear.length) {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        {this.getInformation(gear[index])}
                        {this.getOptions({ disableBack: index === 0 })}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        {this.getConfirmation(cashPayment, this.state.returnProcessor)}
                        {this.getOptions({ showProcess: true })}
                    </div>
                </div>
            );
        }
    }
}
