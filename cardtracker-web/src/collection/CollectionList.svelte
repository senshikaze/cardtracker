<script>
    import {onMount} from 'svelte';

    import {get_collection} from '../services/cards.js';
    import Toast from '../utils/Toast.svelte';
    import AddButton from '../utils/AddButton.svelte';

    let collection = [];
    let toast;
    $: setTimeout(_ => toast = null, 30000);

    onMount(async () => {
        get_collection().then((response) => {
            if (response.error) {
                toast = {type: "error", message: response.message};
                return;
            }
            collection = response;
        });
    });
</script>

<h3>My Collection</h3>
<ul>
    <Toast {...toast} />
    {#each collection as collected}
        <li><a href="/collection/{collected.id}">{collected.card.year} {collected.card.manufacturer} - {collected.card.name} ({collected.count})</a></li>
    {:else}
        <li>No cards collected!</li>
    {/each}
</ul>

<AddButton href="/collection/add" title="Add to collection" />

<style>
    ul {
        list-style-type: none;
    }
</style>
