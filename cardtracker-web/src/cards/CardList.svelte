<script>
    import {cards} from '../stores.js';
</script>

<div>
    <ul>
        {#await cards}
            {#each cards as card}
                <li><a href="/card/{card.id}">{cards.name}</a></li>
            {/each}
        {/await}
    </ul>
</div>