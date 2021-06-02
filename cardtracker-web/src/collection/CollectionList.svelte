<script>
    import {cardTitle} from '../services/strings.js';

    export let collection;
    let lastEvaluatedKey;
</script>

<ul>
    {#each collection as collected}
        <li><a href="/collection/{collected.id}">{cardTitle(collected.card)} ({collected.count})</a></li>
    {:else}
        <li>No cards collected!</li>
    {/each}
    {#if lastEvaluatedKey}<button>Load More TODO</button>{/if}
</ul>


<style>
    ul li {
        border-bottom: 1px solid #ccc;
        padding-bottom: 8px;
        margin: 8px 0px;
    }
    ul li a {
        display: block;
    }
    ul li:hover {
        background-color: #ddd;
    }
</style>
