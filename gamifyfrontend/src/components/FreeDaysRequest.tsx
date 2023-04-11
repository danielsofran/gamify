import {Button, Card, Container, ListGroup} from "react-bootstrap";
import {FreeDaysRequest, SalaryIncreaseRequest} from "../data/Requests";
import {PositionMap, RequestStatus, RequestStatusMap, RequestTypeMap} from "../data/enums";
import {showDate, showDateTime} from "../api/utils";

export const FreeDaysRequestCard = (props : {own: boolean, request: FreeDaysRequest}) => {

    const acceptRequest = () => {

    }

    const rejectRequest = () => {

    }

    return (
        <Card style={{width: "18rem"}}>
            {!props.own &&
                <Card.Header>
                    Requested by: {props.request.user.last_name} {props.request.user.first_name}
                </Card.Header>
            }
            <Card.Body>
                <ListGroup variant="flush">
                    {!props.own && <ListGroup.Item>Salary: {props.request.user.salary}</ListGroup.Item>}
                    {!props.own && <ListGroup.Item>Position: {PositionMap.get(props.request.user.position)}</ListGroup.Item>}
                    <ListGroup.Item>On: {showDateTime(props.request.datetime_requested)}</ListGroup.Item>
                    <ListGroup.Item>Start: {showDate(props.request.date_free_days_start)}</ListGroup.Item>
                    <ListGroup.Item>End: {showDate(props.request.date_free_days_end)}</ListGroup.Item>
                    <ListGroup.Item>Status: {RequestStatusMap.get(props.request.state)}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
            {!props.own && props.request.state === RequestStatus.PENDING &&
                <Card.Footer className="d-flex flex-row justify-content-around">
                    <Button variant="primary" onClick={acceptRequest}>Accept</Button>
                    <Button variant="danger" onClick={rejectRequest}>Reject</Button>
                </Card.Footer>
            }
        </Card>
    );
}