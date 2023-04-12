import {useParams} from "react-router-dom";
import {deserializeUser, Employee} from "../../model/User";
import {useEffect, useState} from "react";
import {axiosJson} from "../../api/axios";
import {Container, Table} from "react-bootstrap";

export const QuestWinners = (props: {rewardable: boolean}) => {
    const { questId } = useParams();
    const [winners, setWinners] = useState<Employee[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        axiosJson.get(`api/quest/${questId}/winners/`).then((response) => {
            if(response.status !== 200) {
                setError(response.statusText);
                return;
            }
            let json = response.data;
            let data = json.map((item: any) =>  deserializeUser(item));
            setWinners(data);
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
            <h1> Winners: </h1>
            <Table className="table-light" striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Place</th>
                    </tr>
                </thead>
                <tbody>
                    {winners.map((winner, index) => {
                        return (
                            <tr key={winner.id}>
                                <td>{getTropy(index)}</td>
                                <td>{winner.first_name}</td>
                                <td>{winner.last_name}</td>
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