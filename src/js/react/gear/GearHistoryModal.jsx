import React from "react";
import PropTypes from "prop-types";
// import { Button, Modal, Tab, Tabs } from "react-bootstrap";

/**
 * Modal to view a gears condition history and reservation history
 */
export default class GearHistoryModal extends React.Component {
    /*
    constructor(props) {
        super(props);

        this.getGearHistoryTab = this.getGearHistoryTab.bind(this);
        this.getReservationHistoryTab = this.getReservationHistoryTab.bind(this);
    }

    getGearHistoryTab(tabKey) {
        console.log(this.props.gearHistory);
        return (
            <Tab eventKey={tabKey} title="Gear History">
                <div className="row">
                    <div className="col-md-12">
                        Gear History Table
                    </div>
                </div>
            </Tab>
        );
    }

    getReservationHistoryTab(tabKey) {
        console.log(this.props.gearReservationHistory);
        return (
            <Tab eventKey={tabKey} title="Reservation History">
                <div className="row">
                    <div className="col-md-12">
                        Reservation History Table
                    </div>
                </div>
            </Tab>
        );
    }

    render() {
        if (this.props.gear) {
            return (
                <Modal
                    show={this.props.show}
                    bsSize="large"
                    onHide={this.props.onClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <span>History for {this.props.gear.code}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs id="gear-history-tabs">
                            {this.getGearHistoryTab(1)}
                            {this.getReservationHistoryTab(2)}
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this.props.onClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        }
        return null;
    }
    */
}

GearHistoryModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    gear: PropTypes.shape({
        code: PropTypes.string
    }),
    gearHistory: PropTypes.oneOfType([
        PropTypes.string, PropTypes.array
    ]).isRequired,
    gearReservationHistory: PropTypes.oneOfType([
        PropTypes.string, PropTypes.array
    ]).isRequired
};
