/**
 * Manages the state for the Reservation, primarily.
 */

import Reflux from "reflux";
import Constants from "../../constants/constants";
import ReservationService from "../../services/ReservationService";
import update from "immutability-helper";

function defaultState() {
    return {
        fetchedReservationList: false,
        error: "",
        statusDropdown: {
            statusSelected: ""
        },
        reservationList: [],
        reservationModal: {
            show: false,
            error: false,
            errorMessage: "",
            mode: null,
            id: null,
            email: "",
            licenseName: "",
            licenseAddress: "",
            startDate: "",
            endDate: "",
            status: ""
        },
        cancelReservationModal: {
            id: null,
            show: false,
            error: false,
            errorMessage: ""
        },
        emailValidationForm: {
            id: null,
            email: null,
            error: false,
            errorMessage: ""
        },
        reservation: {
            id: null,
            email: null,
            licenseName: null,
            licenseAddress: null,
            status: null,
            startDate: null,
            endDate: null,
            gear: []
        },
        fetchedPayPalForm: false,
        payPalForm: null
    };
}

// Create actions and export them for use
export const ReservationActions = Reflux.createActions([
    "fetchReservationList",
    "openReservationModal",
    "openDeleteReservationModal",
    "closeReservationModal",
    "updateDropdown",
    "submitReservationModal",
    "approveReservation",
    "openCancelReservationModal",
    "submitCancelReservationModal",
    "closeCancelReservationModal",
    "openEmailValidationForm",
    "emailValidationFormChanged",
    "fetchReservation",
    "fetchPayPalForm",
    "reservationModalChanged",
    "setReservationModalError"
]);

export class ReservationStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = ReservationActions; // listen for actions
    }

    onFetchReservationList() {
        const service = new ReservationService();

        this.setState({
            fetchedReservationList: true
        });

        return service.fetchReservationList()
            .then(({ data, error }) => {
                if (data) {
                    this.setState({
                        reservationList: data
                    });
                } else {
                    this.setState({
                        error
                    });
                }
            });
    }

    onOpenReservationModal(mode = Constants.modals.CREATING, options = { reservation: {} }) {
        const { id, email, licenseName, licenseAddress, startDate, endDate, status } = options.reservation,
            newState = update(this.state, {
                reservationModal: {
                    show: { $set: true },
                    mode: { $set: mode },
                    id: { $set: id || null },
                    email: { $set: email || "" },
                    licenseName: { $set: licenseName || "" },
                    licenseAddress: { $set: licenseAddress || "" },
                    startDate: { $set: startDate || "" },
                    endDate: { $set: endDate || "" },
                    status: { $set: status || "" }
                }
            });
        this.setState(newState);
    }

    // Close the Reservation Modal
    onCloseReservationModal() {
        const newState = update(this.state, {
            reservationModal: { $set: defaultState().reservationModal }
        });
        this.setState(newState);
    }

    onOpenEmailValidationForm(reservationId) {
        const newState = update(this.state, {
            emailValidationForm: {
                id: { $set: reservationId }
            }
        });
        this.setState(newState);
    }

    onUpdateDropdown(value) {
        this.setState({
            statusDropdown: { statusSelected: value }
        });
    }

    onApproveReservation() {
        const service = new ReservationService();

        return service.approveReservation(this.state.reservationModal.id)
            .then(({ error }) => {
                if (error) {
                    const newState = update(this.state, {
                        reservationModal: {
                            error: { $set: true },
                            errorMessage: { $set: error }
                        }
                    });
                    this.setState(newState);
                } else {
                    const newState = update(this.state, {
                        reservationModal: {
                            status: { $set: "APPROVED" }
                        }
                    });
                    this.setState(newState);
                }
            });
    }

    onEmailValidationFormChanged(field, value) {
        const newState = update(this.state, {
            emailValidationForm: {
                [field]: { $set: value }
            }
        });
        this.setState(newState);
    }

    onFetchReservation() {
        const service = new ReservationService(),
            reservationId = this.state.emailValidationForm.id,
            email = this.state.emailValidationForm.email;

        return service.fetchReservation(reservationId, email)
            .then(({ data, error }) => {
                if (data) {
                    this.setState({
                        reservation: data
                    });
                } else {
                    const newState = update(this.state, {
                        emailValidationForm: {
                            error: { $set: true },
                            errorMessage: { $set: error }
                        }
                    });
                    this.setState(newState);
                }
            });
    }

    onOpenCancelReservationModal(id) {
        const newState = update(this.state, {
            cancelReservationModal: {
                id: { $set: id },
                show: { $set: true },
                error: { $set: false },
                errorMessage: { $set: "" }
            }
        });
        this.setState(newState);
    }

    onSubmitCancelReservationModal() {
        const service = new ReservationService();

        return service.cancelReservation(this.state.cancelReservationModal.id)
            .then(({ error }) => {
                if (error) {
                    const newState = update(this.state, {
                        cancelReservationModal: {
                            error: { $set: true },
                            errorMessage: { $set: error }
                        }
                    });
                    this.setState(newState);
                } else {
                    const newState = update(this.state, {
                        reservationList: {
                            $set: this.state.reservationList.filter(
                                (obj) => {
                                    return obj.id;
                                }
                            )
                        }
                    });
                    this.setState(newState);
                    this.onCloseCancelReservationModal();
                }
            });
    }

    onCloseCancelReservationModal() {
        const newState = update(this.state, {
            cancelReservationModal: { $set: defaultState().cancelReservationModal }
        });
        this.setState(newState);
    }

    onFetchPayPalForm() {
        const service = new ReservationService();

        this.setState({
            fetchedPayPalForm: true
        });

        return service.fetchPayPalForm(this.state.reservation.id)
            .then(({ data, error }) => {
                if (data) {
                    this.setState({
                        payPalForm: data
                    });
                } else {
                    this.setState({
                        error
                    });
                }
            });
    }

    // updates the field values of the reservationModal
    onReservationModalChanged(field, value) {
        const newState = update(this.state, {
            reservationModal: {
                [field]: { $set: value }
            }
        });
        this.setState(newState);
    }

    // onSetReservationModalError(message) {
    //     const newState = update(this.state, {
    //         reservationModal: {
    //             error: { $set: true },
    //             errorMessage: { $set: message }
    //         }
    //     });
    //     this.setState(newState);
    // }
}
