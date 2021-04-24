<script>
    import {onMount} from 'svelte';

    import {cards} from '../stores.js';
    import {get_cards} from '../services/cards';

    onMount(async () => {
        await get_cards().then((response) => {
            if (response.error && response.error === "unauthorized") {
                showLogin = true;
            }
            cards.set(response);
        });
    });
</script>

<div>
    <ul>
        {#each $cards as card}
            <li><a href="/admin/card/{card.id}">{card.year} {card.manufacturer} - {card.name}</a></li>
        {:else}
            <li>No Cards</li>
        {/each}
    </ul>
</div>

<style>
    ul li {
        list-style-type: none;
    }
</style>