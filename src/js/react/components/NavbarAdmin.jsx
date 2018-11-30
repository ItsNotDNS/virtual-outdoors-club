/**
 * Wrapper for Navigation bar in the Admin page
 */
import React from "react";
import Reflux from "reflux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { LoginActions, LoginStore } from "../login/LoginStore";
import Cookies from "universal-cookie";

export default class NavbarAdmin extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = LoginStore;
        this.isAdmin = this.isAdmin.bind(this);
    }

    isAdmin() {
        const cookie = new Cookies();
        // if valid refresh token - get the admin components
        if (cookie.get("refresh")) {
            return (cookie.get("refresh").logged === "admin");
        }
        return false;
    }

    getGearNav() {
        if (this.isAdmin()) {
            return (
                <LinkContainer to="/gear">
                    <NavItem eventKey={1}> Gear </NavItem>
                </LinkContainer>
            );
        }
        return null;
    }

    getMemberNav() {
        if (this.isAdmin()) {
            return (
                <LinkContainer to="/members">
                    <NavItem eventKey={4}> Members </NavItem>
                </LinkContainer>
            );
        }
        return null;
    }

    getActionNav() {
        if (this.isAdmin()) {
            return (
                <NavDropdown eventKey={5} title="Actions" id="nav-dropdown">
                    <LinkContainer to="/disable">
                        <MenuItem eventKey={5.1}>Enable/Disable Rental System</MenuItem>
                    </LinkContainer>
                    <LinkContainer to="/statistics">
                        <MenuItem eventKey={5.2}>Statistics</MenuItem>
                    </LinkContainer>
                    <LinkContainer to="/variability">
                        <MenuItem eventKey={5.3}>System Variables</MenuItem>
                    </LinkContainer>
                    <LinkContainer to="/accounts">
                        <MenuItem eventKey={5.4}>Manage Account</MenuItem>
                    </LinkContainer>
                </NavDropdown>
            );
        }
        return null;
    }
    getHeaderNav() {
        if (this.state.isAuthenticated) {
            return (
                <Navbar.Header>
                    <Navbar.Brand>
                        Outdoors Club Administration
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
            );
        }
        return (
            <Navbar.Header>
                <Navbar.Brand>
                    UofA Outdoors Club Rentals
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
        );
    }

    getReservationNav() {
        if (this.state.isAuthenticated) {
            return (
                <LinkContainer to="/reservation">
                    <NavItem eventKey={3}> Reservations </NavItem>
                </LinkContainer>
            );
        }
        return null;
    }

    getLogoutNav() {
        if (this.state.isAuthenticated) {
            return (
                <LinkContainer to="/">
                    <NavItem onClick={LoginActions.handleLogout} eventKey={7}> Logout </NavItem>
                </LinkContainer>
            );
        }
        return null;
    }

    getHelpNav() {
        if (this.state.isAuthenticated) {
            return (
                <LinkContainer to="/help">
                    <NavItem eventKey={6}> Help </NavItem>
                </LinkContainer>
            );
        }
        return (
            <LinkContainer to="/member-help">
                <NavItem eventKey={6}> Help </NavItem>
            </LinkContainer>
        );
    }
    render() {
        return (
            <Navbar fluid collapseOnSelect className="nav-bar-admin navbar-static-top">
                {this.getHeaderNav()}
                <Navbar.Collapse>
                    <Nav>
                        {this.getGearNav()}
                        <LinkContainer to="/rent">
                            <NavItem eventKey={2}> Rent </NavItem>
                        </LinkContainer>
                        {this.getReservationNav()}
                        {this.getMemberNav()}
                        {this.getActionNav()}
                    </Nav>
                    <Nav pullRight>
                        {this.getHelpNav()}
                        {this.getLogoutNav()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
