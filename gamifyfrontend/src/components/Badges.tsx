import {BadgeReward} from "../model/BadgeReward";
import {Card, Row, Col} from "react-bootstrap";
import {API_URL} from "../api/axios";

export const Badges = (props : {badges: BadgeReward[]}) => {
    const { badges } = props;

    return (
        <Row xs={2} sm={3} md={4} className="g-4">
            {badges.map((badge) => (
                <Col key={badge.id}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex flex-row justify-content-center">
                                <img src={API_URL+badge.image} alt={badge.name} width="100px" height="100px" />
                            </div>
                            <Card.Title>{badge.name}</Card.Title>
                            <Card.Text>{badge.description}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}