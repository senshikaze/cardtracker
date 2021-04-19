import {getLoggedInUser, getSession} from './cognito.js';

const api_endpoint = "https://75785a9hn9.execute-api.us-east-1.amazonaws.com/default";

function getHeaders(user) {
    const authSession = getSession(user);
    return new Headers({'Authorization': `Bearer ${authSession.idToken.jwtToken}`});
}
export const get_cards = async (limit=30, start) => {
    //check auth
    let user = getLoggedInUser();
    if (!user) {
        return {'error': 'unauthorized'};
    }
    const request = new Request(`${api_endpoint}/cards`, {
        method: 'GET',
        headers: getHeaders(user),
        mode: 'cors',
        cache: 'default'
    });
    // get the cards from the api
    //TODO start is the key 
    return fetch(request)
        .then(response => {
            if (response.status == 401) {
                return {'error': 'unauthorized'};
            }
            return response.json();
        })
        .catch(err => console.log('Could not load cards'));
}