<script>
    import {createEventDispatcher} from "svelte";

    import CardSearchResults from '../utils/CardSearchResults.svelte';

    import {findCardById} from '../stores.js';
    import { searchForCard } from "../services/cards_search.js";
    import {cardTitle} from "../services/strings"

    export let card;
    let searchResults;
    const dispatch = createEventDispatcher();

    const searchFor = (event) => {
        if (event.target.value.length > 3) {
            // we have 3 characters in the search, start searching
            searchResults = [...searchForCard(event.target.value)];
        } else {
            searchResults = null;
        }
    };

    const cardSelected = (event) => {
        card = findCardById(event.detail.cardId);
        searchResults = null;
        dispatch('message', {
            card: card
        });
    };

    const removeCard = (event) => {
        card = null;
        dispatch('message', {
            card: card
        });
    }
</script>

{#if card}
    <input value="{cardTitle(card)}" title="{card.id}" disabled /> <span id="removeCard" on:click="{removeCard}">X</span>
{:else}
    <label for="cardSelect">Search for Card</label>
    <input on:keydown="{searchFor}" placeholder="Search..." />
    <CardSearchResults results="{searchResults}" on:message="{cardSelected}" />
{/if}

<style>
    input {
        width: 100%;
    }
    #removeCard {
        cursor: pointer;
        position: relative;
        top: -36px;
        right: 8px;
        text-align: right;
        display: block;
    }
</style>