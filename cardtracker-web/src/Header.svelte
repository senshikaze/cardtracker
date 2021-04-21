<script>
    import router from 'page';

    import {isUserInGroup, isUserValid, signOutUser} from './services/cognito.js';

    const adminHandler = () => {
        router('/admin');
    };

    const signOutHandler = () => {
        signOutUser();
        router('/');
    };
</script>

<header>
    <h1><a href="/">CardTracker</a></h1>
    <span class="right">
        {#if isUserInGroup('admin')}<button on:click="{adminHandler}">Admin</button>{/if}
        {#if isUserValid()}<button on:click="{signOutHandler}">Sign Out</button>{/if}
    </span>
</header>

<style>
    header {
        border-bottom: 1px solid black;
        margin: 0px;
        padding: 0px 16px;
    }

    header h1 {
        display: inline;
    }
</style>
