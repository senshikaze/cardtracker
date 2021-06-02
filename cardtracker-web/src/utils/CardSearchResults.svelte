<script>
    import {createEventDispatcher} from "svelte";
    import {cardTitle} from "../services/strings.js";

    export let results;

    const dispatch = createEventDispatcher();
    const handleClick = (event) => {
        dispatch('message', {
            cardId: event.target.getAttribute('data-cardid')
        });
    };
</script>

{#if results && results.length > 0}
<ul id="searchResults">
    {#each results as result}
        <li on:click="{handleClick}" data-cardId={result.id}>{cardTitle(result)}</li>
    {/each}
</ul>   
{/if}
<style>
    ul {
        z-index: 500;
        display: block;
        max-height: 200px;
        overflow-y: scroll;
        position: relative;
        border: 1px solid #ccc;
        top: -8px;
    }
    ul li {
        padding: 8px;
        cursor: pointer;
    }
    ul li:hover {
        background-color: #ddd;
    }
</style>