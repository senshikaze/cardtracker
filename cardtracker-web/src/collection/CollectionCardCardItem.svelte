<script>
    import {createEventDispatcher} from "svelte";

    import { get_card, get_cards } from "../services/cards.js";

    export let loadedCard;
    let card;
    let cards = [];
    const dispatch = createEventDispatcher();

    const handleSelect = _ => {
        dispatch('message', {
            card: card
        });
    };
</script>

{#if loadedCard}
    <input value="{loadedCard.name}" title="{loadedCard.id}" disabled />
{:else}
    <label for="cardSelect">Search for Card</label>
    <p> TODO </p>
{/if}

<style>
    input {
        width: 100%;
    }
</style>