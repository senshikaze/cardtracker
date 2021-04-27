import { get } from 'svelte/store';
import {isUserValid, getAuthorizationHeaders} from './cognito.js';

import {cards, sets} from '../stores.js';

const api_endpoint = "https://75785a9hn9.execute-api.us-east-1.amazonaws.com/default";

//global cards
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

/**
 * Loads all of the cards from the db into a local cache
 * Refreshes after 24 hours, and will load from local storage otherwise
 * force will ignore the wait
 * Returns void
 */
export const load_cards_into_cache = async (force=false) => {
    if (!isUserValid()) {
        console.log('Could not load cache');
        return;
    }
    if ((window.localStorage['lastRefresh'] && 
         window.localStorage.getItem('lastRefresh') > Date.now() - 86400) && !force) {
        // set stores from cache
        cards.set(JSON.parse(window.localStorage.getItem('cards')));
        sets.set(JSON.parse(window.localStorage.getItem('sets')));
        return;
    }
    let temp_cards = [];
    let lastEvaluatedKey = null;
    do {
        let query = (lastEvaluatedKey) ? `&LastEvaluatedKey=${lastEvaluatedKey}`:'';
        await fetch(`${api_endpoint}/cards?limit=100${query}`, {
            headers: new Headers(getAuthorizationHeaders())
        }).then(async (response) => {
            if (!response.ok) {
                console.error(`Error from api loading cache: ${response.status} - ${await response.json()}`);
                return;
            }
            let ret_cards = await response.json()
            lastEvaluatedKey = ret_cards.LastEvaluatedKey ?? null;
            temp_cards = temp_cards.concat(ret_cards.Items);
        })
        .catch((err) => console.error(err.message))
    } while (lastEvaluatedKey);
    if (!temp_cards) {
        console.error("Error loading cards");
        return;
    }
    temp_cards.sort((a, b) => {
        if (a.id == b.id) return 0;
        return (a.id > b.id)? -1 : 1;
    });
    cards.set(temp_cards);
    // save cards to local store
    window.localStorage.setItem('cards', JSON.stringify(get(cards)));

    // make the sets
    let temp_sets = {};
    temp_cards.forEach((value, key) => {
        temp_sets[`${value.year} ${value.set}`] = temp_sets[`${value.year} ${value.set}`] ?? [];
        temp_sets[`${value.year} ${value.set}`].push(temp_cards[key]);
    });

    // sort sets
    temp_sets = Object.keys(temp_sets).sort().reduce(
        (obj, key) => {
            obj[key] = temp_sets[key];
            return obj;
        }, {}
    );
    sets.set(temp_sets)
    // save sets to local storage
    window.localStorage.setItem('sets', JSON.stringify(get(sets)));

    window.localStorage.setItem('lastRefresh', Date.now());
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