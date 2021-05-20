<script>
    import {onMount} from 'svelte';

    import { sets } from '../stores.js';

    export let collection;
    let collectionSets = new Set();

    onMount(async () => {
        // go over the sets of the cards we have
        // and create a map between the global sets
        // and our collection into collectionSets
        collection.forEach((collected) => {
            collectionSets.add(`${collected.card.year} ${collected.card.manufacturer} ${collected.card.set}`);
        });
        // sort by which set we have
    });    
</script>

<h3>My Sets</h3>
{#each [...collectionSets] as cardSet}
    <h4>{cardSet}</h4>
    <ul>
    {#each $sets[cardSet] as card}
        <li>{card.name}</li>
    {/each}
    </ul>
{:else}
    <p>what</p>
{/each}

<style>

</style>