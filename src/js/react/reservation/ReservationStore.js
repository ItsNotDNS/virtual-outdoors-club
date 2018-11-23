/**
 * Manages the state for the Reservation, primarily.
 */

import Reflux from "reflux";
import ReservationService from "../../services/ReservationService";
import GearService from "../../services/GearService";
import moment from "moment";
import update from "immutability-helper";

function defaultState() {
    return {
        // Reservation Page State
        fetchedReservationList: false,
        error: "",
        reservationList: [],
        reservationModal: {
            show: false,
            alertMsg: "",
            alertType: "",
            gearSelect: {
                isLoading: false,
                fetchedStart: "",
                fetchedEnd: "",
                options: []
            },
            data: {},
            edit: {},
            showConfirmation: ""
        },
        // Payment State
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
        payPalForm: null,
        dateFilter: {
            startDate: null,
            endDate: null
        }
    };
}

// Create and export actions for use
export const ReservationActions = Reflux.createActions([
    "openReservationModal",
    "closeReservationModal",
    "saveReservationChanges",
    "undoReservationChanges",
    "approveReservation",
    "cancelReservation",
    "payCash",
    "editReservation",
    "fetchReservationList",
    "openDeleteReservationModal",
    "updateDropdown",
    "submitReservationModal",
    "openCancelReservationModal",
    "submitCancelReservationModal",
    "closeCancelReservationModal",
    "openEmailValidationForm",
    "emailValidationFormChanged",
    "fetchReservation",
    "fetchPayPalForm",
    "reservationModalChanged",
    "setReservationModalError",
    "loadAvailableGear",
    "addGearToReservation",
    "dateFilterChanged",
    "fetchReservationListFromTo",
    "showConfirmation",
    "hideConfirmation"
]);

export class ReservationStore extends Reflux.Store {
    constructor() {
        super();
        this.state = defaultState();
        this.listenables = ReservationActions; // listen for actions
    }

    onShowConfirmation(type) {
        this.setState(update(this.state, {
            reservationModal: {
                showConfirmation: { $set: type }
            }
        }));
    }

    onHideConfirmation() {
        this.setState(update(this.state, {
            reservationModal: {
                showConfirmation: { $set: "" }
            }
        }));
    }

    onPayCash() {
        const service = new ReservationService();

        return service.payReservationCash(this.state.reservationModal.data.id)
            .then(({ error, reservation }) => {
                if (error) {
                    this.setState(update(this.state, {
                        reservationModal: {
                            alertMsg: { $set: error },
                            alertType: { $set: "danger" }
                        }
                    }));
                } else {
                    this.setState(update(this.state, {
                        reservationModal: {
                            edit: { $set: {} },
                            alertMsg: { $set: "Reservation Paid! You should now hand out the gear to the member." },
                            alertType: { $set: "success" }
                        }
                    }));
                    this.updateModalAndList(reservation);
                    this.onHideConfirmation();
                }
            });
    }

    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    onLoadAvailableGear() {
        const { reservationModal: { gearSelect, edit, data } } = this.state,
            { fetchedStart, fetchedEnd } = gearSelect,
            startDate = moment(edit.startDate || data.startDate).format("YYYY-MM-DD"),
            endDate = moment(edit.endDate || data.endDate).format("YYYY-MM-DD"),
            gear = edit.gear || data.gear,
            shouldUpdate = fetchedStart !== startDate || fetchedEnd !== endDate,
            service = new GearService();

        if (shouldUpdate) {
            const gearCodesReserved = {};
            this.setState(update(this.state, {
                reservationModal: {
                    gearSelect: { isLoading: { $set: true } }
                }
            }));

            gear.forEach((item) => {
                gearCodesReserved[item.code] = true;
            });

            return service.fetchGearListFromTo(startDate, endDate)
                .then(({ error, data }) => {
                    if (error) {
                        this.setState(update(this.state, {
                            reservationModal: {
                                gearSelect: {
                                    isLoading: { $set: false }
                                },
                                alertMsg: { $set: error },
                                alertType: { $set: "danger" }
                            }
                        }));
                    } else {
                        data = data.filter((item) => !gearCodesReserved[item.code]);
                        data = data.map((item) => {
                            return {
                                label: `${item.code} (${item.category}): ${item.description}`,
                                value: item
                            };
                        });

                        this.setState(update(this.state, {
                            reservationModal: {
                                gearSelect: {
                                    isLoading: { $set: false },
                                    fetchedStart: { $set: startDate },
                                    fetchedEnd: { $set: endDate },
                                    options: { $set: data }
                                }
                            }
                        }));
                    }
                });
        }
    }

    onAddGearToReservation({ label, value }) {
        const { reservationModal: { data, edit, gearSelect: { options } } } = this.state,
            gear = this.clone(edit.gear || data.gear),
            newOptions = options.filter((option) => option.label !== label);

        gear.push(value);

        this.setState(update(this.state, {
            reservationModal: {
                edit: {
                    gear: { $set: gear }
                },
                gearSelect: {
                    options: { $set: newOptions }
                }
            }
        }));
    }

    onSaveReservationChanges() {
        const { data: { version, id }, edit: { startDate, endDate, gear } } = this.state.reservationModal,
            updateInfo = { startDate, endDate, gear },
            service = new ReservationService();

        // Remove keys that are empty
        Object.keys(updateInfo).forEach((key) => {
            if (!updateInfo[key]) {
                delete updateInfo[key];
            }
        });

        if (startDate) {
            updateInfo.startDate = moment(updateInfo.startDate).format("YYYY-MM-DD");
        }
        if (endDate) {
            updateInfo.endDate = moment(updateInfo.endDate).format("YYYY-MM-DD");
        }

        // condense gear list to id values
        if (gear) {
            updateInfo.gear = gear.map((item) => item.id);
        }

        // only send the service call if there is an edit
        if (startDate || endDate || gear) {
            return service.updateReservation(id, version, updateInfo)
                .then(({ reservation, error }) => {
                    if (error) {
                        this.setState(update(this.state, {
                            reservationModal: {
                                alertMsg: { $set: error },
                                alertType: { $set: "danger" }
                            }
                        }));
                    } else {
                        const { gearSelect } = defaultState().reservationModal;

                        this.setState(update(this.state, {
                            reservationModal: {
                                edit: { $set: {} },
                                gearSelect: { $set: gearSelect },
                                alertMsg: { $set: "Reservation Saved!" },
                                alertType: { $set: "success" }
                            }
                        }));
                        this.updateModalAndList(reservation);
                    }
                });
        }
    }

    parseReservationData(reservation) {
        reservation = this.clone(reservation);
        reservation.startDate = new Date(reservation.startDate);
        reservation.endDate = new Date(reservation.endDate);

        return reservation;
    }

    updateModalAndList(reservation) {
        const { id } = reservation,
            reservationList = this.state.reservationList.map((item) => {
                return id === item.id ? reservation : item;
            });

        this.setState(update(this.state, {
            reservationList: { $set: reservationList },
            reservationModal: {
                data: { $set: this.parseReservationData(reservation) }
            }
        }));
    }

    onUndoReservationChanges() {
        this.setState(update(this.state, {
            reservationModal: {
                edit: { $set: {} }
            }
        }));
    }

    onOpenReservationModal(reservationInfo) {
        this.setState(update(this.state, {
            reservationModal: {
                show: { $set: true },
                data: { $set: this.parseReservationData(reservationInfo) }
            }
        }));
    }

    onCloseReservationModal() {
        this.setState(update(this.state, {
            reservationModal: { $set: defaultState().reservationModal }
        }));
    }

    onApproveReservation() {
        const id = this.state.reservationModal.data.id,
            service = new ReservationService();

        return service.approveReservation(id)
            .then(({ error, reservation }) => {
                if (error) {
                    this.setState(update(this.state, {
                        reservationModal: {
                            alertMsg: { $set: error },
                            alertType: { $set: "danger" }
                        }
                    }));
                } else {
                    this.setState(update(this.state, {
                        reservationModal: {
                            alertMsg: { $set: "This reservation is now approved!" },
                            alertType: { $set: "success" }
                        }
                    }));
                    this.updateModalAndList(reservation);
                    this.onHideConfirmation();
                }
            });
    }

    onCancelReservation() {
        const id = this.state.reservationModal.data.id,
            service = new ReservationService();

        return service.cancelReservation(id)
            .then(({ error, reservation }) => {
                if (error) {
                    this.setState(update(this.state, {
                        reservationModal: {
                            alertMsg: { $set: error },
                            alertType: { $set: "danger" }
                        }
                    }));
                } else {
                    this.setState(update(this.state, {
                        reservationModal: {
                            alertMsg: { $set: "This reservation is now cancelled." },
                            alertType: { $set: "success" }
                        }
                    }));
                    this.updateModalAndList(reservation);
                    this.onHideConfirmation();
                }
            });
    }

    onEditReservation({ startDate, endDate, gear }) {
        const edit = {};

        if (startDate) {
            edit.startDate = { $set: startDate };
        }
        if (endDate) {
            edit.endDate = { $set: endDate };
        }
        if (gear) {
            edit.gear = { $set: gear };
        }

        this.setState(update(this.state, {
            reservationModal: { edit }
        }));
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

    onOpenEmailValidationForm(reservationId) {
        const newState = update(this.state, {
            emailValidationForm: {
                id: { $set: reservationId }
            }
        });
        this.setState(newState);
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

    onDateFilterChanged(field, date) {
        const newState = update(this.state, {
            dateFilter: {
                [field]: { $set: date }
            }
        });
        this.setState(newState);
    }

    onFetchReservationListFromTo(startDate, endDate) {
        const service = new ReservationService();

        return service.fetchReservationListFromTo(startDate, endDate)
            .then(({ data }) => {
                if (data) {
                    this.setState({
                        reservationList: data
                    });
                }
            });
    }
}
