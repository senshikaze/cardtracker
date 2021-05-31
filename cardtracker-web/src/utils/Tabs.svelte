<script>
    import { createEventDispatcher } from 'svelte';
    export let tabs;
    export let setTab;

    const dispatch = createEventDispatcher();

    const clickTab = (tab) => {
        dispatch('message', {
            tab: tab
        });
    }


</script>

<ul>
    {#each tabs as tab}
        <li class:selected="{tab == setTab}" on:click="{clickTab(tab)}">{tab.toUpperCase()}</li>
    {/each}
</ul>

<style>
    ul {
        margin: 24px 0px;
    }
    ul li {
        display: inline;
        cursor: pointer;
        background-color: rgba(0, 100, 200, 0.2);
        padding: 8px;
    }
    ul li:hover {
        background-color: rgba(0, 100, 200, 0.5);
    }
    .selected {
        background-color: rgb(0, 100, 200);
        color: white;
    }
    .selected {
        background-color: rgba(0, 100, 200, 0.9);
    }

</style>