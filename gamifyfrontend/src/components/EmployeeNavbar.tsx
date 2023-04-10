import {Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import {Link, Outlet} from "react-router-dom";
import React from "react";
import {createBootstrapComponent} from "react-bootstrap/ThemeProvider";
import {logout} from "../api/utils";
import {MyNavbar} from "./MyNavbar";

export const EmployeeNavbar : React.FC = () => {
    return (
        <MyNavbar>
            <Nav.Link href="/employee/quests">Quests</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <NavDropdown title="Shop" id="basic-nav-dropdown">
                <NavDropdown.Item href="/employee/shop/salary-increase"> Salary increase request </NavDropdown.Item>
                <NavDropdown.Item href="/employee/shop/free-days">Free days request</NavDropdown.Item>
                <NavDropdown.Item href="/employee/shop/career-development">Career development request</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Requests" id="basic-nav-dropdown">
                <NavDropdown.Item href="/employee/requests/salary-increase">Salary increase requests </NavDropdown.Item>
                <NavDropdown.Item href="/employee/requests/free-days">Free days requests</NavDropdown.Item>
                <NavDropdown.Item href="/employee/requests/career-development">Career development requests</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/employee/leaderboard">Leaderboard</Nav.Link>

            <Nav.Link onClick={() => logout()}> Logout </Nav.Link>
        </MyNavbar>
    );
}