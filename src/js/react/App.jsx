/**
 * Entry-point for the react code in the app.
 * Allows us to map various URLs to page-components
 */

import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Button } from "react-bootstrap";
import GearPage from "./gear/GearPage";
import ReservationPage from "./reservation/ReservationPage";
import RentPage from "./gear/RentPage";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="page-margin">
                    <Navbar fluid fixedTop >
                        <Navbar.Header>
                            <Navbar.Brand>
                                Administration
                            </Navbar.Brand>
                        </Navbar.Header>
                        <Nav bsStyle="pills">
                            <LinkContainer to="/gear">
                                <NavItem eventKey={1}> Gear </NavItem>
                            </LinkContainer>
                            <LinkContainer to="/rent">
                                <NavItem eventKey={2}> Rent </NavItem>
                            </LinkContainer>
                            <LinkContainer to="/reservation">
                                <NavItem eventKey={3}> Reservations </NavItem>
                            </LinkContainer>
                            <LinkContainer to="#">
                                <NavItem disabled eventKey={4}> Users </NavItem>
                            </LinkContainer>
                            <NavDropdown eventKey={5} title="Actions" id="nav-dropdown">
                                <LinkContainer to="#">
                                    <MenuItem disabled eventKey={5.1}>Enable/Disable Rental System</MenuItem>
                                </LinkContainer>
                                <LinkContainer to="#">
                                    <MenuItem disabled eventKey={5.2}>Statistics</MenuItem>
                                </LinkContainer>
                                <LinkContainer to="#">
                                    <MenuItem disabled eventKey={5.3}>System Variables</MenuItem>
                                </LinkContainer>
                                <LinkContainer to="#">
                                    <MenuItem disabled eventKey={5.4}>Update Membership List</MenuItem>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                        <Navbar.Form pullRight>
                            <LinkContainer to="#">
                                <Button bsStyle="primary"> Logout </Button>
                            </LinkContainer>
                        </Navbar.Form>
                    </Navbar>
                    <Route exact path="/" component={GearPage} />
                    <Route path="/gear" component={GearPage} />
                    <Route path="/reservation" component={ReservationPage} />
                    <Route path="/rent" component={RentPage} />
                </div>
            </BrowserRouter>
        );
    }
}
