import {Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import {Link, Outlet} from "react-router-dom";
import React from "react";
import {createBootstrapComponent} from "react-bootstrap/ThemeProvider";
import {logout} from "../api/utils";
import {MyNavbar} from "./MyNavbar";

export const CeoNavbar : React.FC = () => {
    return (
        <MyNavbar>
            <Nav.Link href="/ceo/quests">Quests</Nav.Link>
            <Nav.Link href="/ceo/register_requests">Register Requests</Nav.Link>
            <NavDropdown title="Requests" id="basic-nav-dropdown">
                <NavDropdown.Item href="/ceo/requests/salary-increase">Salary increase requests </NavDropdown.Item>
                <NavDropdown.Item href="/ceo/requests/free-days">Free days requests</NavDropdown.Item>
                <NavDropdown.Item href="/ceo/requests/career-development">Career development requests</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/ceo/leaderboard">Leaderboard</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link onClick={() => logout()}> Logout </Nav.Link>
        </MyNavbar>
    );
}