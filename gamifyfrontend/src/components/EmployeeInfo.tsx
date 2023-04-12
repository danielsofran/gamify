import {ListGroup} from "react-bootstrap";
import {showDate} from "../api/utils";
import {API_URL} from "../api/axios";
import {PositionMap} from "../model/enums";
import {Employee} from "../model/User";

export const EmployeeInfo = (props : {employee: Employee}) => {
    const {employee} = props;
    return (
        <>
            <ListGroup className="my-3">
                <ListGroup.Item>Username: {employee.username}</ListGroup.Item>
                <ListGroup.Item>First name: {employee.first_name}</ListGroup.Item>
                <ListGroup.Item>Last name: {employee.last_name}</ListGroup.Item>
                <ListGroup.Item>Email: {employee.email}</ListGroup.Item>
                <ListGroup.Item>Date of birth: {showDate(employee.date_of_birth)}</ListGroup.Item>
                <ListGroup.Item>Date of employment: {showDate(employee.date_employed)}</ListGroup.Item>
            </ListGroup>
            <img src={API_URL+employee.image} alt="Profile picture" className="ms-5" width="15%"/>
            <ListGroup horizontal className="my-3 w-100">
                <ListGroup.Item>Tokens: {employee.tokens}</ListGroup.Item>
                <ListGroup.Item>Salary: {employee.salary}</ListGroup.Item>
                <ListGroup.Item>Position: {PositionMap.get(employee.position)}</ListGroup.Item>
            </ListGroup>
        </>
    );
}