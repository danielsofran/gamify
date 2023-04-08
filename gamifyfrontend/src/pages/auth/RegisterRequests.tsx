import React, {useEffect} from "react";
import {API_URL, axiosJson} from "../../api/axios";
import {RegisterRequest} from "../../data/User";
import {Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export const RegisterRequests = () => {
    const [requests, setRequests] = React.useState<RegisterRequest[]>([]);
    const [errorText, setErrorText] = React.useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        axiosJson.get('auth2/register_requests/').then((response) => {
            let requestsJson = RegisterRequest.deserializeArray(response.data);
            setRequests(requestsJson);
        }).catch((error) => {
            setErrorText(error.message);
        });
    }, []);

    const viewRequest = (id: number) => {
        navigate({
            pathname: `/ceo/register_requests/view/${id}/`
            // search: "?id=" + id
        })
    }

    return (
        <Container fluid>
            <h1>Register Requests</h1>
            <table className="table table-secondary table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Nume</th>
                        <th>Prenume</th>
                        <th>Email</th>
                        <th>Data nasterii</th>
                        <th>Imagine de profil</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => {
                        return (
                            <tr key={request.id}>
                                <td>{request.last_name}</td>
                                <td>{request.first_name}</td>
                                <td>{request.email}</td>
                                <td>{request.date_of_birth.toString()}</td>
                                <td><img style={{width: 50, height: "auto", textAlign: "center"}} src={API_URL+request.image}/></td>
                                <td><Button variant="info" onClick={() => viewRequest(request.id)}>Vizualizeaza</Button> </td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>
        </Container>
    )
}