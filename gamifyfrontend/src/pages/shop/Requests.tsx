import {RequestType, RequestTypeMap} from "../../data/enums";
import {Container} from "react-bootstrap";

export const Requests = (props : {own: boolean, type: RequestType}) => {
    return (
        <Container>
            <h1> {RequestTypeMap.get(props.type)} Requests</h1>
        </Container>
    );
}