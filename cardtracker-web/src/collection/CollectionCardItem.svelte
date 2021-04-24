<script>
    import {onMount} from "svelte";
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

    onMount(async () => {
        if (!loadedCard) {
            await get_cards().then((response) => {
                cards = response;
            });
        }        
    });
</script>

{#if loadedCard}
    <input value="{loadedCard.name}" title="{loadedCard.id}" disabled />
{:else}
    <label for="cardSelect">Select Card</label>
    <select bind:value="{card}" on:blur="{handleSelect}">
        <option value="">Please Select...</option>
        {#each cards as chooseCard}
            <option value="{chooseCard}">{chooseCard.year} {chooseCard.manufacturer} - {chooseCard.name}</option>
        {/each}
    </select>
{/if}

<style>
    select {
        width: 100%;
    }
    input {
        width: 100%;
    }
</style>