<script>
    import CollectionList from './CollectionList.svelte';
    import CollectionSet from './CollectionSet.svelte'
    import AddButton from '../utils/AddButton.svelte';
    import Tabs from '../utils/Tabs.svelte';

    let tab = CollectionList;
    let tabName = "list";
    let tabs = ["list", "sets"];

    const handleTabs = (event) => {
        if (event.detail.tab === "sets") {
            tab = CollectionSet;
            tabName = "sets";
        } else if (event.detail.tab === "list") {
            tab = CollectionList;
            tabName = "list";
        }
    };
</script>

<Tabs tabs={tabs} setTab={tabName} on:message="{handleTabs}" />

<div id="collectionCont">
    <svelte:component this={tab} />
</div>

<AddButton href="/collection/add" title="Add to collection" />

<style>
    #collectionCont {
        overflow-y: auto;
    }
    @media only screen and (min-width: 700px) {
        #collectionCont {
            width: 80%;
            margin: 0px auto;
        }
    }
</style>