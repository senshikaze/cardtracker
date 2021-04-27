<script>
    import {onMount} from 'svelte';

    import {cards} from '../stores.js';

</script>

<div>
    <ul>
        {#each $cards as card}
            <li><a href="/admin/card/{card.id}">{card.year} {card.manufacturer} {card.set} - {card.name}</a></li>
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