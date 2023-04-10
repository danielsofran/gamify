import React, {useEffect, useState} from "react";
import {PositionMap, UserType, UserTypeMap} from "../../data/enums";
import {useNavigate} from "react-router-dom";
import {API_URL, axiosJson, getCsrfToken} from "../../api/axios";
import {CEO, deserializeUser, Employee} from "../../data/User";
import {Badge, Form} from "react-bootstrap";
import {MyAlert} from "../../components/Alerts";
import {convertDateTimeToField} from "../../api/utils";
import {Badges} from "../../components/Badges";


export const Profile = () => {
    const [user, setUser] = useState<Employee | CEO>(new Employee());

    const navigate = useNavigate();

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        axiosJson.get('auth2/user/').then((response) => {
            let userJson = deserializeUser(response.data);
            // console.warn("Deserialized user: ", userJson)
            setUser(userJson);
            console.info("User: ", user)
            //setAuth({user, roles: [user.type]})
        }).catch((error) => {
            console.log("RequireAuth axios error:\n"+error);
        });
        getCsrfToken();
    }, [])

    return (
        <div className="container">
            <h1>Profile</h1>
            <Form>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        required={true}
                        value={user.username}
                            disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        required={true}
                        value={user.email}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicFirstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        required={true}
                        value={user.first_name}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        required={true}
                        value={user.last_name}
                        disabled={true}
                    />
                </Form.Group>


                <Form.Group controlId="formBasicPassword2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Repeat password"
                        required={true}
                        value={user.password}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicImage">
                    <Form.Label>Profile picture</Form.Label><br/>
                    <img src={API_URL+user.image} alt="Profile picture" width="100" height="auto"/>
                </Form.Group>
                
                <Form.Group controlId="formBasicType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter type"
                        required={true}
                        value={UserTypeMap.get(user.type)}
                        disabled={true}
                    />
                </Form.Group>

            {user.type === UserType.Employee &&
            <>
                <Form.Group controlId="formBasicPosition">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter position"
                        required={true}
                        value={!(user instanceof CEO) ? PositionMap.get(user.position) : ''}
                        disabled={true}
                    />
                </Form.Group>
                
                <Form.Group controlId="formBasicDateOfBirth">
                    <Form.Label>Date of birth</Form.Label>
                    <Form.Control
                        type="date"
                        value={convertDateTimeToField(!(user instanceof CEO) ?user.date_of_birth : new Date()).slice(0, 10)}
                        required={true}
                        disabled={true}
                    />
                </Form.Group>
                
                <Form.Group controlId="formBasicDateOfEmployment">
                    <Form.Label>Date of employment</Form.Label>
                    <Form.Control
                        type="date"
                        value={convertDateTimeToField(!(user instanceof CEO) ?user.date_employed : new Date()).slice(0, 10)}
                        required={true}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicSalary">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter salary"
                        required={true}
                        value={!(user instanceof CEO) ? user.salary : 0}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicTokens">
                    <Form.Label>Tokens</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter tokens"
                        required={true}
                        value={!(user instanceof CEO) ? user.tokens : 0}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDiscount">
                    <Form.Label>Discount for the next purchase </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter discount"
                        required={true}
                        value={!(user instanceof CEO) ? user.discount_next_purchase * 100 + " %" : "0 %"}
                        disabled={true}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicBadges">
                    <Form.Label>Badges</Form.Label><br/>
                    <Badges badges={!(user instanceof CEO) ? user.badges : []}/>
                </Form.Group>
            </>
            }
                {error && <MyAlert text={error} variant="danger" onClose={() => setError('')}/>}
                {success && <MyAlert text={success} variant="success" onClose={() => setSuccess('')}/>}
            </Form>
        </div>
    );
}