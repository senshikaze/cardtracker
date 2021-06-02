import {get} from 'svelte/store';
import {cards} from '../stores.js';

/**
 * Search for a card in the local store
 * TODO add a pull from the repo if not found locally
 * @param {string} query: the card to search for. can be any one of "id", "name", "team", "series", "set" 
 */
export const searchForCard = (query) => {
    let loadedCards = get(cards);
    // player names
    let ids = loadedCards.filter(x => x.id.toLowerCase().includes(query));
    let players = loadedCards.filter(x => x.name.toLowerCase().includes(query));
    let teams = loadedCards.filter(x => x.team.toLowerCase().includes(query));
    let seriess = loadedCards.filter(x => x.series.toLowerCase().includes(query));
    let sets = loadedCards.filter(x => x.set.toLowerCase().includes(query));
    // combine the cards as a set
    return new Set([...ids, ...players, ...teams, ...seriess, ...sets]);
};