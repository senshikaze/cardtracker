import {isUserValid, getAuthorizationHeaders} from './cognito.js';

const api_endpoint = "https://75785a9hn9.execute-api.us-east-1.amazonaws.com/default";

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
                return {error: 'error from api', 'message': await response.json()}
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
                return {error: 'error from api', message: await response.json()}
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
                return {error: 'error from api', message: await response.json()}
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}

export const save_card = async (card) => {
    if (!isUserValid()) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/cards/`, {
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
                return {error: 'error from api', message: await response.json()}
            }
            return response.json();
        })
        .catch(err => console.log(err.message));
}
