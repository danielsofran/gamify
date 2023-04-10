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
            <Nav.Link href="/ceo/leaderboard">Leaderboard</Nav.Link>

            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link onClick={() => logout()}> Logout </Nav.Link>
        </MyNavbar>
    );
}