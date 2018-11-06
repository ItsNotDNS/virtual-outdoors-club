import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";

export default class NavbarAdmin extends React.Component {
    render() {
        return (
            <Navbar fluid collapseOnSelect >
                <Navbar.Header>
                    <Navbar.Brand>
                        Administration
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/gear">
                            <NavItem eventKey={1}> Gear </NavItem>
                        </LinkContainer>
                        <LinkContainer to="/rent">
                            <NavItem eventKey={2}> Rent </NavItem>
                        </LinkContainer>
                        <LinkContainer to="/reservation">
                            <NavItem eventKey={3}> Reservations </NavItem>
                        </LinkContainer>
                        <LinkContainer to="/members">
                            <NavItem eventKey={4}> Members </NavItem>
                        </LinkContainer>
                        <NavDropdown eventKey={5} title="Actions" id="nav-dropdown">
                            <LinkContainer to="#">
                                <MenuItem disabled eventKey={5.1}>Enable/Disable Rental System</MenuItem>
                            </LinkContainer>
                            <LinkContainer to="#">
                                <MenuItem disabled eventKey={5.2}>Statistics</MenuItem>
                            </LinkContainer>
                            <LinkContainer to="/variability">
                                <MenuItem eventKey={5.3}>System Variables</MenuItem>
                            </LinkContainer>
                            <LinkContainer to="/accounts">
                                <MenuItem eventKey={5.4}>Manage Account</MenuItem>
                            </LinkContainer>
                        </NavDropdown>
                    </Nav>
                    <Nav pullRight>
                        <LinkContainer to="/login">
                            <NavItem eventKey={6}> Logout </NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
