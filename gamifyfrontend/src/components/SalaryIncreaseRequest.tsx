import {Button, Card, Container, ListGroup} from "react-bootstrap";
import {SalaryIncreaseRequest} from "../model/Requests";
import {PositionMap, RequestStatus, RequestStatusMap, RequestType, RequestTypeMap} from "../model/enums";
import {showDateTime} from "../api/utils";
import {axiosCsrf} from "../api/axios";

export const SalaryIncreaseRequestCard = (props : {own: boolean, request: SalaryIncreaseRequest}) => {

    const acceptRequest = () => {
        axiosCsrf.post(`api/request/${RequestType.SALARY_INCREASE}/${props.request.id}/`).then((response) => {
            if(response.status === 200) {
                console.log("Accepted request")
                window.location.reload();
            }
        }).catch((error) => {
            console.warn(error);
        });
    }

    const rejectRequest = () => {
        axiosCsrf.delete(`api/request/${RequestType.SALARY_INCREASE}/${props.request.id}/`).then((response) => {
            if(response.status === 200) {
                console.log("Rejected request")
                window.location.reload();
            }
        }).catch((error) => {
            console.warn(error);
        });
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
                    {props.request.fixed_amount > 0 && <ListGroup.Item>Fixed amount: {props.request.fixed_amount}</ListGroup.Item>}
                    {props.request.percentage > 0 && <ListGroup.Item>Percentage: {props.request.percentage}</ListGroup.Item>}
                    <ListGroup.Item> Salary increase: {props.request.salary_increase}</ListGroup.Item>
                    <ListGroup.Item> Status: {RequestStatusMap.get(props.request.state)}</ListGroup.Item>
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