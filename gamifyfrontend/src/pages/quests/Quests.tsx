import {Col, Container, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import { Quest } from "../../model/Quests";
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
                // console.log(model);
            }
            else {
                console.log("Error");
                console.log(response);
            }
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <Container fluid>
            <h1>Quest List</h1>
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                {quests.map((quest) => (
                    <Col key={quest.id}>
                        <QuestCard key={quest.id} quest={quest} editable={props.editable} />
                    </Col>
                ))}
            </Row>
        </Container>
    )
}