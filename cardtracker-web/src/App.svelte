<script>
    import router from "page";
    import { onMount } from "svelte";

    import { getLoggedInUser } from "./services/cognito.js";

    import Header from './Header.svelte';
    import Admin from './Admin.svelte';
    import Home from './Home.svelte';
    import CardPage from './cards/CardPage.svelte';
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

    router.start();

    onMount(async () => {
        var user = getLoggedInUser();
        if (!user) {
            showLogin = true;
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

<style>
    main {
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

	@media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>