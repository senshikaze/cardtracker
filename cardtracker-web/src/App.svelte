<script>
    import router, { show } from "page";
    import { onMount } from "svelte";

    import { getLoggedInUser } from "./services/cognito.js";
    import { load_cards_into_cache, get_collection } from "./services/cards";

    import { collection, userActive } from './stores.js';

    import Header from './Header.svelte';
    import Admin from './Admin.svelte';
    import Home from './Home.svelte';
    import CardPage from './cards/CardPage.svelte';
    import CollectionHome from './collection/CollectionHome.svelte';
    import CollectionCardPage from './collection/CollectionCardPage.svelte';
    import Login from './Login.svelte';

    let showLogin = false;

    let page;
    let params;
    router('/', () => page = Home);
    router('/admin', () => page = Admin);
    router('/admin/card/add', (ctx, next) => {
        params = ctx.params
        next()}, () => page = CardPage);
    router('/admin/card/:id', (ctx, next) => {
        params = ctx.params
        next()}, () => page = CardPage);
    router('/collection', () => page = CollectionHome);
    router('/collection/add', (ctx, next) => {
        params = ctx.params
        next()},() => page = CollectionCardPage);
    router('/collection/:id', (ctx, next) => {
        params = ctx.params
        next()}, () => page = CollectionCardPage);

    router.start();

    $: {
        if ($userActive) {
            showLogin = false;
            load_cards_into_cache();
            get_collection();
        } else {
            showLogin = true;
        }
    }
    onMount(async () => {
        var user = getLoggedInUser();
        if (!user) {
            $userActive = false;
        } else {
            $userActive = true;
        }
    });
</script>

<Header />
<main>
	{#if !showLogin}
        <svelte:component this={page} params={params} />
    {:else}
        <Login />
    {/if}
</main>
