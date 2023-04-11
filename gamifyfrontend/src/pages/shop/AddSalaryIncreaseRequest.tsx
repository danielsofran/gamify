import {Button, Container, Form, Badge} from "react-bootstrap";
import {deserializeUser, Employee} from "../../data/User";
import {LegacyRef, useEffect, useRef, useState} from "react";
import {axiosCsrf, axiosJson} from "../../api/axios";
import {MyAlert} from "../../components/Alerts";
import {RequestType} from "../../data/enums";
import {useNavigate} from "react-router-dom";

export const AddSalaryIncreaseRequest = () => {
    const [employee, setEmployee] = useState<Employee>(new Employee());
    const [tokens, setTokens] = useState<number>(0);
    const [fixedAmount, setFixedAmount] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

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
        axiosJson.get(`api/get_tokens/${RequestType.SALARY_INCREASE}/`,
            {
                params: {
                    fixed_amount: isNaN(fixedAmount) ? 0 : fixedAmount,
                    percentage: isNaN(percentage) ? 0 : percentage,
                }
            }).then((response) => {
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

        const data = {
            fixed_amount: isNaN(fixedAmount) ? 0 : fixedAmount,
            percentage: isNaN(percentage) ? 0 : percentage,
            description: description,
        }
        axiosCsrf.post(`api/add_request/salary_increase/`, data).then((response) => {
            if(response.status !== 201) {
                setError(response.data.error);
                return;
            }
            setSuccess("Request successfully created");
            navigate("/employee/requests/salary-increase/");
        }).catch((error) => {
            setError(error.response.data.error);
        });
    }

    return (
        <Container>
            <h1> Purchase salary increase request </h1>
            <p> <Badge bg="info" className="rounded-pill"> ! </Badge> You have {employee.tokens} tokens </p>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        as={"textarea"}
                        placeholder="Enter description for the request"
                        required={true}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formFixedAmount">
                    <Form.Label>Fixed amount</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter fixed amount for the salary increase"
                        value={fixedAmount}
                        required={true}
                        min={0}
                        onChange={(event) => setFixedAmount(parseInt(event.target.value))}
                    />
                </Form.Group>
                <Form.Group controlId="formPercentage">
                    <Form.Label>Percentage</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter percentage for the salary increase"
                        value={percentage}
                        required={true}
                        min={0}
                        max={100}
                        onChange={(event) => setPercentage(parseInt(event.target.value))}
                    />
                </Form.Group>

                {success && <MyAlert variant="success" text={success} onClose={() => setSuccess('')} />}
                {error && <MyAlert variant="danger" text={error} onClose={() => setError('')} />}
                <Button variant="primary" type="button" onClick={getTokens} className="my-3"> Calculate tokens </Button>

                <div id="purchaseArea" className="visually-hidden">
                    <Form.Group controlId="formTokens">
                        <Form.Label>Tokens</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Tokens"
                            value={tokens}
                            readOnly={true}
                        />
                    </Form.Group>
                    <Button id="purchaseBtn" variant="primary" type="submit" className="my-3"> Purchase </Button>
                </div>
            </Form>
        </Container>
    );
}