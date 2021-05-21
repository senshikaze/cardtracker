<script>
    import {onMount} from 'svelte';

    import { sets } from '../stores.js';
    import {card_title, set_title} from '../services/strings.js';

    export let collection;
    let collectionBySet = new Object();

    onMount(async () => {
        // go over the sets of the cards we have
        // and create a map between the global sets
        // and our collection into collectionSets
        collection.forEach(collectedCard => {
            collectionBySet[set_title(collectedCard.card)] = collectionBySet[set_title(collectedCard.card)] ?? [];
            collectionBySet[set_title(collectedCard.card)].push(collectedCard);
        });
    });    
</script>


<h3>My Sets</h3>
{#each Object.keys(collectionBySet) as setNames}
    <h4>{setNames}</h4>
    <ul>
    {#each collectionBySet[setNames] as setcard}
        <li>{card_title(setcard.card)}</li>
    {/each}
    </ul>
{/each}


<h3>All Sets</h3>
{#each Object.keys($sets) as cardSet}
    <h4>{cardSet}</h4>
    <p>Cards:</p>
    <ul>
        {#each $sets[cardSet] as card}
            <li>{card_title(card)}</li>
        {/each}
    </ul>
{/each}

<style>
 ul li {
     list-style: none;
 }
</style>