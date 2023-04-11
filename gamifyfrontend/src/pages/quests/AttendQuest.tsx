import {useParams} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Quest} from "../../data/Quests";
import {FormEvent, useEffect, useState} from "react";
import {axiosJson, axiosMultipart, getCookie, getCsrfToken} from "../../api/axios";
import {QuestDisplay} from "../../components/QuestDisplay";
import {MyAlert} from "../../components/Alerts";

export const AttendQuest = () => {
    const { questId } = useParams();
    const [quest, setQuest] = useState<Quest>(new Quest());
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        getCsrfToken();
        axiosJson.get(`api/quest/${questId}/`).then((response) => {
            if(response.status === 200) {
                setQuest(response.data);
            }
            else {
                setError("Error loading quest!");
                console.log("Error");
                console.log(response);
            }
        }).catch((error) => {
            setError("Error loading quest!");
            console.log("Error");
            console.log(error);
        });
    }, [])

    const handleImagesChange = (event: any) => {
        if(event.target.files) {
            setImages(Array.from(event.target.files));
            setImageUrls(Array.from(event.target.files).map((file: any) => URL.createObjectURL(file)));
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("csrfmiddlewaretoken", getCookie("csrftoken"));
        formData.append("quest_id", `${quest.id}`);
        images.forEach((image, index) => {
            formData.append(`image${index}`, image);
        });

        axiosMultipart.postForm(`api/quest/${quest.id}/`, formData).then((response) => {
            if (response.status === 201) {
                setSuccess("Successfully submitted!");
            } else {
                setError("Error submitting quest attend!");
                console.log("Error");
                console.log(response);
            }
        }).catch((error) => {
            setError(error.textMessage);
            console.log("Error");
            console.log(error);
        });
    }

    return (
        <Container>
            <QuestDisplay quest={quest} />
            <h3 className="mt-3">Add photos as proof</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicImages">
                    <Form.Label>Images</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        required={true}
                        onChange={handleImagesChange}
                    />
                </Form.Group>

                <Button variant={"primary"} type={"submit"} className="mt-3">Submit</Button>
            </Form>

            {success && <MyAlert text={success} variant={"success"} onClose={() => setSuccess('')} />}
            {error && <MyAlert text={error} variant={"danger"} onClose={() => setError('')} />}

            <Container className="mt-3">
            {imageUrls.length > 0 &&
            <>
                <p className="mb-4"> Preview uploaded images </p>
                <Row>
                    {imageUrls.map((url, index) => (
                        <Col key={index} className="d-flex flex-column justify-content-center">
                            <img src={url} alt="preview" className="img-fluid" height="100px" width="auto" />
                        </Col>
                    ))}
                </Row>
            </>
            }
            </Container>
        </Container>
    )
}