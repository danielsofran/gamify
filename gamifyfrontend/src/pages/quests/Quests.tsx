import {Col, Container, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import { Quest } from "../../data/Quests";
import {axiosJson} from "../../api/axios";
import {QuestCard} from "../../components/QuestCard";
import {useNavigate} from "react-router-dom";

export const Quests = (props : {editable: boolean}) => {
    const [quests, setQuests] = useState<Quest[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axiosJson.get('api/quests/').then((response) => {
            if(response.status === 200) {
                let data = Quest.deserializeArray(response.data);
                setQuests(data);
                // console.log(data);
            }
            else {
                console.log("Error");
                console.log(response);
            }
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const addQuest = () => {
        navigate("/add_quest/");
    }

    return (
        <Container fluid>
            <div className="d-flex justify-content-between mb-3">
                <h1>Quest List</h1>
                <button className="btn btn-primary" onClick={addQuest}>Create Quest</button>
            </div>
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                {quests.map((quest) => (
                    <Col>
                        <QuestCard key={quest.id} quest={quest} editable={props.editable} />
                    </Col>
                ))}
            </Row>
        </Container>
    )
}