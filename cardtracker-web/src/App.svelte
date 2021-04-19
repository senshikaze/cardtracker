<script>
    import router from "page";
    import { onMount } from "svelte";

    import { get_cards } from "./services/cards.js";
    import { getLoggedInUser } from "./services/cognito.js";

    import Home from './Home.svelte';
    import CardPage from './cards/CardPage.svelte';
    import Login from './Login.svelte';

    let showLogin = false;

    let page;
    router('/', () => page = Home);
    router(
        '/card/:id',
        (ctx, next) => {params = ctx.params; next()},
        () => page = CardPage
    );

    router.start();

    onMount(async () => {
        var user = getLoggedInUser();
        if (!user) {
            showLogin = true;
        }
        if (!showLogin){
            await get_cards().then((response) => {
                console.log(response);
                if (response.error && response.error === "unauthorized") {
                    showLogin = true;
                }
            });
        }
    });

    const handleLogin = (event) => {
        if (event.detail.success) {
            showLogin = true;
        }
    };
</script>

<main>
	{#if !showLogin}
        <svelte:component this={page} />
    {:else}
        <Login on:message={handleLogin} />
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