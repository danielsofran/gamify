import {Quest} from "../model/Quests";
import {Card, ListGroup} from "react-bootstrap";
import {showDateTime} from "../api/utils";
import {useEffect, useState} from "react";
import {QuestDifficulty, QuestDifficultyMap, QuestStatus} from "../model/enums";
import {useNavigate} from "react-router-dom";
import {axiosCsrf} from "../api/axios";
import {Color} from "react-bootstrap/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlagCheckered} from "@fortawesome/free-solid-svg-icons";

export const QuestCard = (props: { editable: boolean, quest: Quest }) => {
    const [bg, setBg] = useState<Color>("light");
    const [fg, setFg] = useState<Color>("light");
    const [state, setState] = useState<QuestStatus>(QuestStatus.IN_PROGRESS);
    const navigate = useNavigate();

    useEffect(() => {
        if(new Date() > new Date(props.quest.datetime_end) ||
            (new Date() <= new Date(props.quest.datetime_end) &&
                props.quest.no_of_winners >= props.quest.max_winners)) {
            setBg("secondary");
            setState(QuestStatus.FINISHED);
        }
        else if(new Date(props.quest.datetime_start) > new Date()) {
            setBg("light");
            setFg("dark");
            setState(QuestStatus.NOT_STARTED);
        }
        else {
            setState(QuestStatus.IN_PROGRESS);
            if(props.quest.solved) {
                setBg("success");
            }
            else {
                setBg("light");
                setFg("dark");
            }
        }
    }, [props.quest.datetime_start, props.quest.datetime_end, props.quest.max_winners, props.quest.no_of_winners]);

    const attendQuest = () => {
        navigate(`/employee/quests/${props.quest.id}/attend/`)
    }

    const viewQuestWinners = () => {
        let head = props?.editable === true ? "ceo" : "employee";
        navigate(`/${head}/quests/${props.quest.id}/winners/`)
    }

    const deleteQuest = () => {
        axiosCsrf.delete("api/quest/"+props.quest.id+"/").then((response) => {
            if(response.status === 204) {
                window.location.reload();
            }
            else {
                console.log("Error");
                console.log(response);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const difficultyIcon = () => (props.quest.difficulty === QuestDifficulty.EASY) ? "🐣" : (props.quest.difficulty === QuestDifficulty.MEDIUM) ? "🐥" : "🐔";

    // time icon
    const solvedIcon = () => {
        if(props.quest.solved) return  <span title='Solved'>✅</span>;
        else if(state === QuestStatus.IN_PROGRESS) return <span title='Ongoing'>⏳</span>;
        else if(state === QuestStatus.NOT_STARTED) return <span title='Not started yet'>⏰</span>;
        else if(state === QuestStatus.FINISHED) return <span title='Finished'><FontAwesomeIcon icon={faFlagCheckered}/></span>;
        else return "❌";
    }

    const showAtttend = ():boolean =>
        state === QuestStatus.IN_PROGRESS && !props.editable && [undefined, false].includes(props.quest.solved) &&
        props.quest.no_of_winners < props.quest.max_winners && new Date() <= new Date(props.quest.datetime_end);


    return (
        <Card style={{width: "20rem"}} bg={bg} text={fg} key={props.quest.id}>
            <Card.Header> Author: {props.quest.author.last_name} {props.quest.author.first_name} </Card.Header>
            <Card.Body>
                <Card.Title> {solvedIcon()} Quest: {props.quest.title} </Card.Title>
                <Card.Text> {props.quest.description} </Card.Text>
            </Card.Body>
            <ListGroup className={"list-group-flush"}>
                <ListGroup.Item> <>Start on: {showDateTime(props.quest.datetime_start)}</> </ListGroup.Item>
                <ListGroup.Item> <>Deadline: {showDateTime(props.quest.datetime_end)}</> </ListGroup.Item>
                <ListGroup.Item> <>Difficulty: {QuestDifficultyMap.get(props.quest.difficulty)} {difficultyIcon()}</> </ListGroup.Item>
                <ListGroup.Item> <>Maximum number of winners: {props.quest.max_winners}</> </ListGroup.Item>
                <ListGroup.Item> <>Token prize: {props.quest.tokens}</> </ListGroup.Item>
                <ListGroup.Item> <>Current number of winners: {props.quest.no_of_winners}</> </ListGroup.Item>
            </ListGroup>
            <Card.Footer>
                <div className="d-flex justify-content-around">
                    {showAtttend() && <button className="btn btn-outline-dark" onClick={attendQuest}>Attend</button>}
                    <button className="btn btn-info" onClick={viewQuestWinners}>View winners</button>
                    {props?.editable === true && <button className="btn btn-danger" onClick={deleteQuest}>Delete</button>}
                </div>
            </Card.Footer>
        </Card>
    )
}