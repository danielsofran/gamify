import {useParams} from "react-router-dom";
import {deserializeUser, Employee} from "../../data/User";
import {useEffect, useState} from "react";
import {axiosJson} from "../../api/axios";
import {Container, Table} from "react-bootstrap";
import {EmployeePoints} from "../../data/Quests";

export const Leaderboard = (props: {rewardable: boolean}) => {
    const [employees, setEmployees] = useState<EmployeePoints[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        axiosJson.get(`api/leaderboard/`).then((response) => {
            if(response.status !== 200) {
                setError(response.statusText);
                return;
            }
            let json = response.data;
            let data = EmployeePoints.deserializeArray(json);
            setEmployees(data);
        }).catch((error) => {
            setError(error);
        });
    }, []);

    const getTropy = (index: number) => {
        switch (index) {
            case 0:
                return "🥇";
            case 1:
                return "🥈";
            case 2:
                return "🥉";
            default:
                return "🏅";
        }
    }

    return (
        <Container>
            <h1> Leaderboard </h1>
            <Table className="table-light" striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Points</th>
                        <th>Place</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => {
                        return (
                            <tr key={employee.employee.id}>
                                <td>{getTropy(index)}</td>
                                <td>{employee.employee.first_name}</td>
                                <td>{employee.employee.last_name}</td>
                                <td>{employee.points}</td>
                                <td>{index+1}</td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </Table>
        </Container>
    )
}