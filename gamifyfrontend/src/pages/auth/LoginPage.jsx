import React, {ChildContextProvider, useContext, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';
import {axiosCsrf, DjangoCsrfToken, getCookie, getCsrfToken} from "../../api/axios";
import {MyAlert} from "../../components/Alerts";
import {useNavigate} from "react-router-dom";
import {CEO, deserializeUser, Employee} from "../../data/User";
import useAuth from "../../hooks/useAuth";
import {UserType} from "../../data/enums";

export const LoginPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [error, setError] = React.useState('');

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.user !== null && auth.user !== undefined && auth.user.type !== undefined) {
            if(auth.user.type === UserType.CEO) navigate("/ceo");
            else if(auth.user.type === UserType.Employee) navigate("/employee");
        }
        getCsrfToken();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        axiosCsrf.post('auth2/login/', {username, password})
            .then((response) => {
                setSuccess(response.data.user.username + " successfully logged in!");
                let jsonUser = response.data.user;
                let user = deserializeUser(jsonUser);
                let roles = [user.type]
                console.warn(user, roles)
                console.warn(auth, setAuth)
                setAuth({user, roles});
                console.info(auth)
            }).catch((error) => {
                console.log(error);
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