import {isUserValid, getAuthorizationHeaders} from './cognito.js';

const api_endpoint = "https://75785a9hn9.execute-api.us-east-1.amazonaws.com/default";

//global cards
export const get_cards = async (limit=30, start) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/cards`, {
        method: 'GET',
        headers: new Headers(getAuthorizationHeaders()),
        mode: 'cors',
        cache: 'default'
    });
    //TODO start is the key 
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', 'message': await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

export const delete_card = async (id) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/cards/${id}`, {
        method: 'DELETE',
        headers: new Headers({
            ...getAuthorizationHeaders(),
            'Content-Type': 'application/json'
        }),
        mode: 'cors',
        cache: 'default'
    });
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', message: await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

export const get_card = async (id) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/cards/${id}`, {
        method: 'GET',
        headers: new Headers(getAuthorizationHeaders()),
        mode: 'cors',
        cache: 'default'
    });
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', message: await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

export const save_card = async (card) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/cards`, {
        method: 'PUT',
        headers: new Headers({
            ...getAuthorizationHeaders(),
            'Content-Type': 'application/json'
        }),
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(card)
    });
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', message: await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

//collection
export const get_collection = async () => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/collection`, {
        method: 'GET',
        headers: new Headers(getAuthorizationHeaders()),
        mode: 'cors',
        cache: 'default'
    });
    //TODO start is the key 
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', 'message': await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

//collection cards
export const add_collection_card = async (card) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/collection`, {
        method: 'PUT',
        headers: new Headers({
            ...getAuthorizationHeaders(),
            'Content-Type': 'application/json'
        }),
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(card)
    });
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', message: await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

export const delete_collection_card = async (card) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/collection/${card.id}`, {
        method: 'DELETE',
        headers: new Headers({
            ...getAuthorizationHeaders(),
            'Content-Type': 'application/json'
        }),
        mode: 'cors',
        cache: 'default'
    });
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', message: await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

export const get_collection_card = async (id) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/collection/${id}`, {
        method: 'GET',
        headers: new Headers(getAuthorizationHeaders()),
        mode: 'cors',
        cache: 'default'
    });
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', message: await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

export const save_collection_card = async (card) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/collection/${card.id}`, {
        method: 'PUT',
        headers: new Headers({
            ...getAuthorizationHeaders(),
            'Content-Type': 'application/json'
        }),
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(card)
    });
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', message: await response.json()};
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

export const save_collection_image = async (card, image, file) => {
    if(!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/collection/${card.id}/images`, {
        method: 'POST',
        headers: new Headers({
            ...getAuthorizationHeaders(),
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(image)
    });
    return fetch(request)
        .then(async response => {
            if (!response.ok) {
                if (response.status === 401) {
                    return {error: 'unauthorized'};
                }
                return {error: 'error from api', message: await response.json()};
            }
            //attempt to upload file
            let respJson = await response.json();
            let fileForm = new FormData();
            Object.entries(respJson.signedData.fields).forEach(([k, v]) => {
                fileForm.append(k, v);
            });
            fileForm.append("file", file[0]);
            const upload_request = new Request(respJson.signedData.url, {
                method: 'POST',
                body: fileForm
            });
            return fetch(upload_request).then(async (upload_response) => {
                if (!upload_response.ok) {
                    if (upload_response.status === 401) {
                        return {error: 'unauthorized'};
                    }
                    return {error: 'error from s3', message: await upload_response.json()};
                }
                return respJson;
            })
            .catch(err => console.error(err.message));
        })
        .catch(err => console.error(err.message));
}