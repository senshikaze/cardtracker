<script>
    import {onMount} from 'svelte';

    import {get_collection} from '../services/cards.js';
    import CollectionList from './CollectionList.svelte';
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
<Toast {...toast} />

{#if tab == "list"}
<CollectionList collection="{collection}" />
{/if}

{#if tab == "sets"}
<CollectionSet collection="{collection}" />
{/if}

<AddButton href="/collection/add" title="Add to collection" />
