import {Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import {Link, Outlet} from "react-router-dom";
import React from "react";
import {createBootstrapComponent} from "react-bootstrap/ThemeProvider";
import {logout} from "../api/utils";

export const MyNavbar = (props: {children: React.ReactNode }) => {
    let expand = 'md';
    return (
        <>
            <Navbar sticky="top" key={expand} expand={expand} bg="light" className="nav-tabs mb-3">
                <Container fluid>
                    <Navbar.Brand href="#">Meniu</Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-${expand}`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                        placement="start"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                Meniu
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-start flex-grow-1 pe-3">
                                {props.children}
                            </Nav>
                            {/*<Form className="d-flex">*/}
                            {/*    <Form.Control*/}
                            {/*        type="search"*/}
                            {/*        placeholder="Search"*/}
                            {/*        className="me-2"*/}
                            {/*        aria-label="Search"*/}
                            {/*    />*/}
                            {/*    <Button variant="outline-success">Search</Button>*/}
                            {/*</Form>*/}
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}