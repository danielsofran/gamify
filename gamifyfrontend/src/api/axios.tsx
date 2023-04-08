import axios from "axios";

export const API_URL = "http://localhost:8000";

const axiosGet =  axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "application/json"
    },
    withCredentials: true,
});

const axiosPost =  axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
    },
    withCredentials: true,
});

const axiosPostImage =  axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "multipart/form-data",
        "X-CSRFToken": getCookie("csrftoken"),
    },
    withCredentials: true,
});

var _csrfToken = getCsrfToken();

export async function getCsrfToken():Promise<string> {

    const response = await fetch(`${API_URL}/csrf/`, {
        credentials: 'include',
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;
    return _csrfToken;
}

export function getCookie(name: string) : string|null {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export { axiosGet, axiosPost, axiosPostImage };