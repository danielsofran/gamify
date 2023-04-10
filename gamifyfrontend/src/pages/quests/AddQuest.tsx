import {Button, Container, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {QuestDifficulty} from "../../data/enums";
import {CEO, deserializeUser, Employee} from "../../data/User";
import {axiosJson, axiosCsrf, getCsrfToken} from "../../api/axios";
import {useNavigate} from "react-router-dom";
import {convertDateTimeToField} from "../../api/utils";
import {MyAlert} from "../../components/Alerts";

export const AddQuest = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [difficulty, setDifficulty] = useState<QuestDifficulty>(QuestDifficulty.MEDIUM);
    const [datetimeStart, setDatetimeStart] = useState<Date>(new Date());
    const [datetimeEnd, setDatetimeEnd] = useState<Date>(new Date());
    const [maxWinners, setMaxWinners] = useState<number>(0);
    const [tokens, setTokens] = useState<number>(0);

    const navigate = useNavigate();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getCsrfToken();
    });

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = {
            title: title,
            description: description,
            difficulty: difficulty,
            datetime_start: datetimeStart,
            datetime_end: datetimeEnd,
            max_winners: maxWinners,
            tokens: tokens
        }
        axiosCsrf.post('api/add_quest/', data).then((response) => {
            if(response.status === 201) {
                setSuccess("Quest created successfully");
            }
            else {
                setError("Quest creation failed");
                console.log(response);
            }
        }).catch((error) => {
            setError("Quest creation failed");
            console.log(error);
        });
    }

    return (
        <Container className="w-75 g-3">
            <h1>Add Quest</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicQuestName">
                    <Form.Label>Quest Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter quest name"
                        name="title"
                        required={true}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicQuestDescription">
                    <Form.Label>Quest Description</Form.Label>
                    <Form.Control
                        as={"textarea"}
                        placeholder="Enter quest description"
                        name="description"
                        required={true}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicQuestDifficulty">
                    <Form.Label>Quest Difficulty</Form.Label>
                    <Form.Control
                        as="select"
                        name="difficulty"
                        required={true}
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                    >
                        <option value={QuestDifficulty.EASY}>Easy</option>
                        <option value={QuestDifficulty.MEDIUM}>Medium</option>
                        <option value={QuestDifficulty.HARD}>Hard</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formBasicQuestStart">
                    <Form.Label>Quest Start</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="datetime_start"
                        required={true}
                        value={convertDateTimeToField(datetimeStart)}
                        onChange={(e) => setDatetimeStart(new Date(e.target.value))}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicQuestEnd">
                    <Form.Label>Quest End</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="datetime_end"
                        required={true}
                        value={convertDateTimeToField(datetimeEnd)}
                        onChange={(e) => setDatetimeEnd(new Date(e.target.value))}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicQuestMaxWinners">
                    <Form.Label>Quest Max Winners</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Enter quest max winners"
                        name="max_winners"
                        required={true}
                        value={maxWinners}
                        onChange={(e) => setMaxWinners(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))}
                    />
                </Form.Group>
                <Form.Group controlId="formBasicQuestTokens">
                    <Form.Label>Quest Tokens</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        placeholder="Enter quest tokens"
                        name="tokens"
                        required={true}
                        value={tokens}
                        onChange={(e) => setTokens(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))}
                    />
                </Form.Group>

                {error && <MyAlert text={error} variant="danger" onClose={() => setError('')} />}
                {success && <MyAlert text={success} variant="success" onClose={() => setSuccess('')} />}

                <Button type="submit" className="btn btn-primary mt-3">Submit</Button>
            </Form>
        </Container>
    )
}