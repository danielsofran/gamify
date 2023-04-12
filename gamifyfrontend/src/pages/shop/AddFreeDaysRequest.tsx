import {Badge, Button, Container, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {deserializeUser, Employee} from "../../model/User";
import {useNavigate} from "react-router-dom";
import {axiosCsrf, axiosJson} from "../../api/axios";
import {RequestType} from "../../model/enums";
import {convertDateTimeToField} from "../../api/utils";
import {MyAlert} from "../../components/Alerts";

export const AddFreeDaysRequest = () => {
    const [description, setDescription] = useState<string>("");
    const [employee, setEmployee] = useState<Employee>(new Employee());
    const [tokens, setTokens] = useState<number>(0);
    const [dateFreeDaysStart, setDateFreeDaysStart] = useState<Date>(new Date());
    const [dateFreeDaysEnd, setDateFreeDaysEnd] = useState<Date>(new Date());

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

    const navigate = useNavigate();
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");

    const getTokens = () => {
        axiosJson.get(`api/get_tokens/${RequestType.FREE_DAYS}/`,
            {
                params: {
                    datetime_free_days_start: dateFreeDaysStart.toISOString().slice(0, 16),
                    datetime_free_days_end: dateFreeDaysEnd.toISOString().slice(0, 16),
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
        }).catch((error) => {
            setError(error.response.data.error);
        });
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        if(employee.tokens < tokens) {
            setError("You don't have enough tokens");
            return;
        }

        if(dateFreeDaysStart > dateFreeDaysEnd) {
            setError("Date free days start must be before date free days end");
            return;
        }

        const data = {
            description: description,
            datetime_free_days_start: dateFreeDaysStart.toISOString().slice(0, 16),
            datetime_free_days_end: dateFreeDaysEnd.toISOString().slice(0, 16),
        }
        axiosCsrf.post(`api/add_request/free_days/`, data).then((response) => {
            if(response.status !== 200) {
                setError(response.data.error);
                return;
            }
            setSuccess("Request sent successfully");
            navigate("/employee/requests/free-days/");
        }).catch((error) => {
            setError(error.response.data.error);
        });
    }

    return (
        <Container>
            <h1> Purchase free days request </h1>
            <p> <Badge bg="info" className="rounded-pill"> ! </Badge> You have {employee.tokens} tokens </p>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label> Description </Form.Label>
                    <Form.Control
                        as="textarea" rows={3} value={description}
                        placeholder={"Enter description"} required={true}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDateFreeDaysStart">
                    <Form.Label> Date free days start </Form.Label>
                    <Form.Control
                        type="date"
                        value={convertDateTimeToField(dateFreeDaysStart).slice(0, 10)}
                        required={true} placeholder={"Enter date free days start"}
                        onChange={(e) => setDateFreeDaysStart(new Date(e.target.value))}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDateFreeDaysEnd">
                    <Form.Label> Date free days end </Form.Label>
                    <Form.Control
                        type="date"
                        value={convertDateTimeToField(dateFreeDaysEnd).slice(0, 10)}
                        required={true} placeholder={"Enter date free days end"}
                        onChange={(e) => setDateFreeDaysEnd(new Date(e.target.value))}
                    />
                </Form.Group>

                { success && <MyAlert text={success} variant={"success"} onClose={() => setSuccess("")}/> }
                { error && <MyAlert text={error} variant={"danger"} onClose={() => setError("")}/> }
                <Button variant={"primary"} onClick={getTokens} className="my-3"> Calculate tokens </Button>

                <div id="purchaseArea" className="visually-hidden">
                    <Form.Group className="mb-3" controlId="formTokens">
                        <Form.Label> Tokens </Form.Label>
                        <Form.Control type="number" value={tokens} required={true} readOnly={true}/>
                    </Form.Group>
                    <Button id="purchaseBtn" variant={"primary"} className="my-3" type="submit"> Purchase </Button>
                </div>
            </Form>
        </Container>
    );
}