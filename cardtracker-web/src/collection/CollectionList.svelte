<script>
    import {onMount} from 'svelte';

    import {get_collection} from '../services/cards.js';
    import CollectionSet from './CollectionSet.svelte'
    import Toast from '../utils/Toast.svelte';
    import AddButton from '../utils/AddButton.svelte';
    import Tabs from '../utils/Tabs.svelte';

    let collection = [];
    let lastEvaluatedKey = null;
    let toast;
    let tab = "list";
    let tabs = ["list", "sets"];

    const handleTabs = (event) => {
        tab = event.detail.tab;
    };
    
    $: setTimeout(_ => toast = null, 30000);

    onMount(async () => {
        get_collection().then((response) => {
            if (response.error) {
                toast = {type: "error", message: response.message};
                return;
            }
            collection = response.Items;
            lastEvaluatedKey = response.LastEvaluatedKey ?? null;
        });
    });
</script>

<Tabs tabs={tabs} setTab={tab} on:message="{handleTabs}" />

{#if tab == "list"}
<h3>My Collection</h3>
<ul>
    <Toast {...toast} />
    {#each collection as collected}
        <li><a href="/collection/{collected.id}">{collected.card.year} {collected.card.manufacturer} {collected.card.set} - {collected.card.name} ({collected.count})</a></li>
    {:else}
        <li>No cards collected!</li>
    {/each}
    {#if lastEvaluatedKey}<button>Load More TODO</button>{/if}
</ul>
{/if}

{#if tab == "sets"}
<CollectionSet collection="{collection}" />
{/if}

<AddButton href="/collection/add" title="Add to collection" />

<style>
    ul {
        list-style-type: none;
    }
</style>
