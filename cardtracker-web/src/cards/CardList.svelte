<script>
    import {onMount} from 'svelte';

    import {cards} from '../stores.js';
    import {get_cards} from '../services/cards';

    let lastEvaluatedKey;

    onMount(async () => {
        await get_cards().then((response) => {
            cards.set(response.Items);
            lastEvaluatedKey = response.LastEvaluatedKey ?? null;
        });
    });
</script>

<div>
    <ul>
        {#each $cards as card}
            <li><a href="/admin/card/{card.id}">{card.year} {card.manufacturer} {card.set} - {card.name}</a></li>
        {:else}
            <li>No Cards</li>
        {/each}
        {#if lastEvaluatedKey}<button>Load More TODO</button>{/if}
    </ul>
</div>

<style>
    ul li {
        list-style-type: none;
    }
</style>