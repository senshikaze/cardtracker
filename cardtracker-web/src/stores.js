import {writable, get} from 'svelte/store';

export const cards = writable([]);

export const collection = writable([]);

export const sets = writable([]);

export const userActive = writable(false);

export const findCardById = (cardId) => {
    let loadedCards = get(cards);
    return loadedCards.filter(x => x.id === cardId)[0];
};
