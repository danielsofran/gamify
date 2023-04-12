import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, {FormEvent, useEffect, useState} from "react";
import {Position, UserType} from "../../model/enums";
import {API_URL, axiosJson, axiosCsrf, axiosMultipart, getCookie, getCsrfToken} from "../../api/axios";
import {Button, Form} from "react-bootstrap";
import {MyAlert} from "../../components/Alerts";
import {Employee, RegisterRequest} from "../../model/User";

export const ViewRegisterRequest:React.FC<{request?: RegisterRequest}> = ({request = undefined}) => {
    const id = useParams().id;
    const [employee, setEmployee] = React.useState<Employee>(new Employee());
    const [salary, setSalary] = React.useState<number>(0);
    const [position, setPosition] = React.useState<Position>(Position.INTERN);
    const [dateEmployed, setDateEmployed] = React.useState<Date>(new Date());
    const [tokens, setTokens] = React.useState<number>(0);

    const navigate = useNavigate();

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const setEmployeeFromRequest = (req: RegisterRequest) => {
        employee.id = req.id;
        employee.username = req.username;
        employee.email = req.email;
        employee.first_name = req.first_name;
        employee.last_name = req.last_name;
        employee.date_of_birth = req.date_of_birth;
        employee.image = req.image;
        employee.type = UserType.Employee;
        setEmployee(employee)
        navigate('#')
    }

    useEffect(() => {
        if(request === undefined) {
            axiosJson.get("auth2/get_register_request/" + id + "/").then((response) => {
                request = RegisterRequest.deserialize(response.data);
                setEmployeeFromRequest(request);
                console.log(request, employee);
            }).catch((error) => {
                setError(error.message);
            });
        }
        else setEmployeeFromRequest(request);
        getCsrfToken();
    }, []);

    const handleAccept = () => {
        const json = {
            "csrfmiddlewaretoken": getCookie("csrftoken"),
            "register_request_id": employee.id,
            "accepted": true,
            "salary": salary,
            "position": position,
            "date_employed": dateEmployed.toISOString().slice(0, 10),
            "tokens": tokens,
        }

        axiosCsrf.post("auth2/save_register_request/", json).then((response) => {
            if (response.status === 200) {
                setSuccess(response.statusText);
                navigate('/ceo/register_requests/');
            } else {
                setError(response.statusText);
            }
        });
    }

    const handleReject = () => {
        const json = {
            "csrfmiddlewaretoken": getCookie("csrftoken"),
            "register_request_id": employee.id,
            "accepted": false,
        }
        axiosCsrf.post("auth2/save_register_request/", json).then((response) => {
            if (response.status === 200) {
                setSuccess(response.statusText);
                navigate('/ceo/register_requests/');
            } else {
                setError(response.statusText);
            }
        }).catch((error) => {
            setError(error.message);
        });
    }

    return (
        <div className="container">
            <h1>Datele angajatului</h1>
            <Form>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        required={true}
                        value={employee.username}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        required={true}
                        value={employee.email}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicFirstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        required={true}
                        value={employee.first_name}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        required={true}
                        value={employee.last_name}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDateOfBirth">
                    <Form.Label>Date of birth</Form.Label>
                    <Form.Control
                        type="date"
                        value={employee.date_of_birth.toString()}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicImage">
                    <Form.Label>Profile picture</Form.Label><br/>
                    <img src={API_URL + employee.image} alt="Profile picture" width="100" height="auto"/>
                </Form.Group>

                <Form.Group controlId="formBasicSalary">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter salary"
                        required={true}
                        value={salary}
                        onChange={(e) => setSalary(parseInt(e.target.value))}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPosition">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                        as="select"
                        value={position}
                        onChange={(e) => setPosition(parseInt(e.target.value))}
                    >
                        <option value={Position.INTERN}>Intern</option>
                        <option value={Position.JUNIOR}>Junior</option>
                        <option value={Position.MIDDLE}>Middle</option>
                        <option value={Position.SENIOR}>Senior</option>
                        <option value={Position.LEAD}>Team Leader</option>
                        <option value={Position.MANAGER}>Manager</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formBasicDateEmployed">
                    <Form.Label>Date employed</Form.Label>
                    <Form.Control
                        type="date"
                        value={dateEmployed.toISOString().slice(0, 10)}
                        required={true}
                        onChange={(e) => setDateEmployed(new Date(e.target.value))}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicTokens">
                    <Form.Label>Tokens</Form.Label>
                    <Form.Range
                        min="0"
                        max="1000"
                        step="10"
                        // value={employee.tokens}
                        onChange={(e) => setTokens(parseInt(e.target.value))}
                    />
                    <Form.Text className="text-muted">
                        Number of initial tokens : {tokens}
                    </Form.Text>
                </Form.Group>




                {error && <MyAlert text={error} variant="danger" onClose={() => setError('')}/>}
                {success && <MyAlert text={success} variant="success" onClose={() => setSuccess('')}/>}

                <div className="d-flex justify-content-around">
                    <Button className='mt-1' variant="success" type="button"
                        onClick={handleAccept}>
                        Accept
                    </Button>
                    <Button className='mt-1' variant="danger" type="button"
                        onClick={handleReject}>
                        Reject
                    </Button>
                </div>

            </Form>
        </div>
    );
}