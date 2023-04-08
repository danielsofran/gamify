import React, {ChildContextProvider, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';
import {axiosPost, DjangoCsrfToken, getCookie, getCsrfToken} from "../api/axios";
import {MyAlert} from "../components/Alerts";
import {useNavigate} from "react-router-dom";
import {CEO, deserializeUser, Employee} from "../data/User";
import authProvider from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";

export const LoginPage = () => {
    const { setAuth } = useAuth();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');

    const navigate = useNavigate();

    useEffect(() => {
        getCsrfToken();
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axiosPost.post('auth2/login/', {username, password})
            .then((response) => {
                setSuccess(response.data.role + " successfully logged in!");
                let jsonUser = response.data.user;
                let user: CEO|Employee = deserializeUser(jsonUser);
                setAuth(user);
            }).catch((error) => {
                setError(error.response.data.error);
            });
    }

    return (
        <div className="container mt-3 w-75">
            <h1 className="text-center">Connect</h1>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                {success !== '' && <MyAlert text={success} variant='success' onClose={() => setSuccess('')}/>}
                {error !== '' && <MyAlert text={error} variant='danger' onClose={() => setError('')}/>}

                <div className="d-flex justify-content-around">
                    <Button className='mt-2' variant="primary" type="submit">
                        Log In
                    </Button>
                    <Button className='mt-2' variant="outline-dark" type="button" onClick={() => navigate('/register')}>
                        Register
                    </Button>
                </div>

                {/*<Button variant="outline-dark" type="button" onClick={(e) => handleLogout(e)}>*/}
                {/*    Log Out*/}
                {/*</Button>*/}
            </Form>
        </div>
    );
}