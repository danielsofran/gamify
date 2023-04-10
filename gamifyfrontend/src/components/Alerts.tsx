import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

export const MyAlert: React.FC<{text: string, variant: string, onClose: () => void}> = ({text, variant = "success", onClose = () => {}}) => {
    const [show, setShow] = useState(true);

    const header = new Map();
    header.set("success", "Succes!");
    header.set("danger", "Eroare!");
    header.set("warning", "Atentie!");
    header.set("info", "Info!");

    if (show) {
        return (
            <Alert className="m-1" variant={variant} onClose={() => {setShow(false); onClose();}} dismissible>
                <Alert.Heading>{header.get(variant)}</Alert.Heading>
                <p>{text}</p>
            </Alert>
        );
    }
    return <span></span>;
}