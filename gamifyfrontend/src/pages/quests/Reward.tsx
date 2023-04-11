import {useParams} from "react-router-dom";
import {Button, Container, Form, ListGroup} from "react-bootstrap";
import {deserializeUser, Employee} from "../../data/User";
import {useEffect, useState} from "react";
import {API_URL, axiosCsrf, axiosJson} from "../../api/axios";
import {PositionMap} from "../../data/enums";
import {showDate, showDateTime} from "../../api/utils";
import {MyAlert} from "../../components/Alerts";
import {EmployeeInfo} from "../../components/EmployeeInfo";

export const Reward = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState<Employee>(new Employee());
    const [tokens, setTokens] = useState<number>(0);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        axiosJson.get(`auth2/employee/${id}/`).then((response) => {
            if(response.status !== 200) {
                setError(response.statusText);
                return;
            }
            let json = response.data;
            let data = deserializeUser(json);
            if(data instanceof Employee)
                setEmployee(data);
            else
                setError("Invalid user type");
        });
    }, []);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        axiosCsrf.post(`api/reward/${id}/`, {tokens: tokens}).then((response) => {
            if(response.status !== 201) {
                setError(response.statusText);
                return;
            }
            window.location.reload();
        });
    }

    return (
        <Container>
            <h1> Reward <span className=''>{employee.first_name} {employee.last_name}</span> </h1>
            <EmployeeInfo employee={employee} />
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicTokens">
                    <Form.Label>Tokens</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter tokens"
                        min={1}
                        max={10000}
                        required
                        value={tokens}
                        onChange={(event) => setTokens(parseInt(event.target.value))}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3"> Add Tokens </Button>

                {error && <MyAlert variant={'danger'} text={error} onClose={() => setError('')} />}
            </Form>
        </Container>
    )
}