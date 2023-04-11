import {Badge, Button, Container, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {deserializeUser, Employee} from "../../data/User";
import {useNavigate} from "react-router-dom";
import {Position, PositionMap, RequestType} from "../../data/enums";
import {axiosCsrf, axiosJson} from "../../api/axios";
import {MyAlert} from "../../components/Alerts";

export const AddCareerDevelopmentRequest = () => {
    const [employee, setEmployee] = useState<Employee>(new Employee());
    const [tokens, setTokens] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [position, setPosition] = useState<Position>(Position.INTERN);

    const navigate = useNavigate();
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        axiosJson.get(`auth2/user/`).then((response) => {
            if(response.status !== 200) {
                setError(response.data.error);
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

    const getTokens = () => {
        axiosJson.get(`api/get_tokens/${RequestType.CAREER_DEVELOPMENT}/`,
            {
                params: {
                    position: position,
                }
            }
            ).then((response) => {
            if(response.status !== 200) {
                console.log(response.data);
                setError(response.data.error);
                return;
            }
            let json = response.data;
            setTokens(json.tokens);
            document.getElementById("purchaseArea")!.classList.remove("visually-hidden");
            if(employee.tokens >= json.tokens)
                document.getElementById("purchaseBtn")!.classList.remove("disabled");
            else
                document.getElementById("purchaseBtn")!.classList.add("disabled");
        });
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        if(employee.tokens < tokens) {
            setError("You don't have enough tokens");
            return;
        }

        if(employee.position >= position) {
            setError("You can't purchase a career development request for a lower position");
            return;
        }

        const data = {
            description: description,
            position: position,
        }
        axiosCsrf.post(`api/add_request/career_development/`, data).then((response) => {
            if(response.status !== 201) {
                setError(response.data.error);
                return;
            }
            setSuccess("Request successfully added");
            navigate("/employee/requests/career-development/");
        }).catch((error) => {
            setError(error.response.data.error);
        });
    }

    return (
        <Container>
            <h1> Purchase career development request </h1>
            <p> <Badge bg="info" className="rounded-pill"> ! </Badge> You have {employee.tokens} tokens </p>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label> Description </Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder={"Enter description"}
                                  value={description} required={true}
                                  onChange={(event) => setDescription(event.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPosition">
                    <Form.Label> Position </Form.Label>
                    <Form.Select required={true}
                        value={position}
                        onChange={(event) => setPosition(parseInt(event.target.value))}>
                        {Array.from(PositionMap.values()).map((value, key) => {
                            return <option key={key} value={key}> {value} </option>
                        })}
                    </Form.Select>
                </Form.Group>

                {error && <MyAlert text={error} variant={"danger"} onClose={() => setError("")} />}
                {success && <MyAlert text={success} variant={"success"} onClose={() => setSuccess("")} />}

                <Button variant="primary" type="button" className="mt-3" onClick={getTokens}> Calculate Tokens </Button>

                <div id="purchaseArea" className="visually-hidden">
                    <Form.Group className="mb-3" controlId="formTokens">
                        <Form.Label> Tokens </Form.Label>
                        <Form.Control type="number" placeholder="Tokens" value={tokens} readOnly={true} />
                    </Form.Group>
                    <Button id="purchaseBtn" variant="primary" type="submit" className="my-3"> Purchase </Button>
                </div>
            </Form>
        </Container>
    );
}