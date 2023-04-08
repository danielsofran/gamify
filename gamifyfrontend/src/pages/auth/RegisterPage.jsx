import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {MyAlert} from "../../components/Alerts";
import {axiosMultipart, getCookie, getCsrfToken} from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {UserType} from "../../data/enums";

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [image, setImage] = useState();

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const formRef = React.createRef();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if(auth?.user !== null && auth?.user !== undefined && auth?.user.type !== undefined) {
            if(auth.user.type === UserType.CEO) navigate("/ceo");
            else if(auth.user.type === UserType.Employee) navigate("/employee");
        }
        getCsrfToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password !== password2) {
            setError("Passwords don't match");
            return;
        }

        const formData = new FormData();
        formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
        formData.append("username", username);
        formData.append("email", email);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("password", password);
        formData.append("date_of_birth", dateOfBirth);
        if (image !== null) formData.append("image", image, image.name);
        else formData.append("image", "");

        axiosMultipart.postForm("auth2/register/", formData).then((response) => {
            if (response.status === 200) {
                setSuccess(response.statusText);
            } else {
                setError(response.statusText);
            }
        });
    }

    return (
        <div className="container">
            <h1>Register</h1>
            <Form ref={formRef} onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        required={true}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicFirstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        required={true}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        required={true}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword2">
                    <Form.Label>Repeat password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Repeat password"
                        required={true}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDateOfBirth">
                    <Form.Label>Date of birth</Form.Label>
                    <Form.Control
                        type="date"
                        value={dateOfBirth}
                        required={true}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicImage">
                    <Form.Label>Profile picture</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        name="image"
                        required={false}
                        onChange={(e) => setImage(e.target.files?.item(0) || null)}
                    />
                </Form.Group>

                {error && <MyAlert text={error} variant="danger" onClose={() => setError('')}/>}
                {success && <MyAlert text={success} variant="success" onClose={() => setSuccess('')}/>}

                <div className="d-flex justify-content-around">
                    <Button className='mt-1' variant="primary" type="submit">
                        Register
                    </Button>
                    <Button className='mt-1' variant="outline-secondary" type="reset">
                        Reset
                    </Button>
                </div>

            </Form>
        </div>
    )
}