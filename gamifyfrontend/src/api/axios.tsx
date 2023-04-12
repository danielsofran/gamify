import axios from "axios";

export const API_URL = "http://localhost:8000";

const axiosJson =  axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "application/json"
    },
    withCredentials: true,
});

const axiosCsrf =  axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
    },
    withCredentials: true,
});

const axiosMultipart =  axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "multipart/form-model",
        "X-CSRFToken": getCookie("csrftoken"),
    },
    withCredentials: true,
});

var _csrfToken;

export async function getCsrfToken():Promise<string> {

    const response = await fetch(`${API_URL}/auth2/csrf/`, {
        credentials: 'include',
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;
    return _csrfToken;
}

export function getCookie(name: string) : string {
    let cookieValue = "";
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

export const DjangoCsrfToken = async () => {
    let token: string = await getCsrfToken();
    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={token}/>
    )
}

export { axiosJson, axiosCsrf, axiosMultipart };