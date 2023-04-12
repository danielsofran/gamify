import {RequestType, RequestTypeMap} from "../../model/enums";
import {Col, Container, Row} from "react-bootstrap";
import {CareerDevelopmentRequest, FreeDaysRequest, SalaryIncreaseRequest} from "../../model/Requests";
import {useEffect, useState} from "react";
import {SalaryIncreaseRequestCard} from "../../components/SalaryIncreaseRequest";
import {axiosJson} from "../../api/axios";
import {FreeDaysRequestCard} from "../../components/FreeDaysRequest";
import {CareerDevelopmentRequestCard} from "../../components/CareerDevelopmentRequest";

export const Requests = (props : {own: boolean, type: RequestType}) => {
    const [salaryIncreaseRequests, setSalaryIncreaseRequests] = useState<SalaryIncreaseRequest[]>([]);
    const [freeDayRequests, setFreeDayRequests] = useState<FreeDaysRequest[]>([]);
    const [careerDevelopmentRequests, setCareerDevelopmentRequests] = useState<CareerDevelopmentRequest[]>([]);

    useEffect(() => {
        if(props.type === RequestType.SALARY_INCREASE) {
            axiosJson.get(`/api/requests/${RequestType.SALARY_INCREASE}/`).then((response) => {
                if (response.status === 200) {
                    let salaryIncreaseRequests = SalaryIncreaseRequest.deserializeArray(response.data);
                    setSalaryIncreaseRequests(salaryIncreaseRequests);
                }
            });
        }
        else if(props.type === RequestType.FREE_DAYS) {
            axiosJson.get(`/api/requests/${RequestType.FREE_DAYS}/`).then((response) => {
                if (response.status === 200) {
                    let freeDayRequests = FreeDaysRequest.deserializeArray(response.data);
                    setFreeDayRequests(freeDayRequests);
                }
            });
        }
        else if(props.type === RequestType.CAREER_DEVELOPMENT) {
            axiosJson.get(`/api/requests/${RequestType.CAREER_DEVELOPMENT}/`).then((response) => {
                if (response.status === 200) {
                    let careerDevelopmentRequests = CareerDevelopmentRequest.deserializeArray(response.data);
                    setCareerDevelopmentRequests(careerDevelopmentRequests);
                }
            });
        }
    }, []);

    return (
        <Container>
            <h1 className="mb-3"> {RequestTypeMap.get(props.type)} Requests</h1>
            <Row xs={1} sm={2} md={3} xl={4} xxl={5} className="g-4">
                {props.type === RequestType.SALARY_INCREASE &&
                    salaryIncreaseRequests.map((request) =>
                        <Col key={request.id} className='m-3'>
                            <SalaryIncreaseRequestCard own={props.own} request={request}/>
                        </Col>
                    )
                }
                {props.type === RequestType.FREE_DAYS &&
                    freeDayRequests.map((request) =>
                        <Col key={request.id} className='m-3'>
                            <FreeDaysRequestCard own={props.own} request={request}/>
                        </Col>
                    )
                }
                {props.type === RequestType.CAREER_DEVELOPMENT &&
                    careerDevelopmentRequests.map((request) =>
                        <Col key={request.id} className='m-3'>
                            <CareerDevelopmentRequestCard own={props.own} request={request}/>
                        </Col>
                    )
                }
            </Row>
        </Container>
    );
}