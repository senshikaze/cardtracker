<script>
    import {cards} from '../stores.js';
    import {cardTitle} from '../services/strings.js';
</script>

<div>
    <ul>
        {#each $cards as card}
            <li><a href="/admin/card/{card.id}">{cardTitle(card)}</a></li>
        {:else}
            <li>No Cards</li>
        {/each}
    </ul>
</div>
