import {Quest} from "../data/Quests";
import {Card, ListGroup} from "react-bootstrap";
import {showDateTime} from "../api/utils";
import {useEffect, useState} from "react";
import {QuestDifficulty, QuestDifficultyMap} from "../data/enums";
import {useNavigate} from "react-router-dom";
import {axiosCsrf} from "../api/axios";
import {Color} from "react-bootstrap/types";

export const QuestDisplay = (props: { quest: Quest }) => {

    const difficultyIcon = () => (props.quest.difficulty === QuestDifficulty.EASY) ? "🐣" : (props.quest.difficulty === QuestDifficulty.MEDIUM) ? "🐥" : "🐔";
    const difficultyColor = () => (props.quest.difficulty === QuestDifficulty.EASY) ? "success" : (props.quest.difficulty === QuestDifficulty.MEDIUM) ? "warning" : "danger";

    return (
        <div className='container'>
            <h1> Quest: {props.quest.title} </h1>
            <h4> Descriere </h4>
            <p className='fs-4 mb-4'>{props.quest.description}</p>
            <ListGroup className={"list-group-flush"} horizontal>
                <ListGroup.Item variant={"success"}> <>Start on: {showDateTime(props.quest.datetime_start)}</> </ListGroup.Item>
                <ListGroup.Item> <>Deadline: {showDateTime(props.quest.datetime_end)}</> </ListGroup.Item>
                <ListGroup.Item variant={difficultyColor()}> <>Difficulty: {QuestDifficultyMap.get(props.quest.difficulty)} {difficultyIcon()}</> </ListGroup.Item>
                <ListGroup.Item> <>Maximum number of winners: {props.quest.max_winners}</> </ListGroup.Item>
                <ListGroup.Item variant={'warning'}> <>Token prize: {props.quest.tokens}</> </ListGroup.Item>
                <ListGroup.Item> <>Current number of winners: {props.quest.no_of_winners}</> </ListGroup.Item>
            </ListGroup>
        </div>
    )
}