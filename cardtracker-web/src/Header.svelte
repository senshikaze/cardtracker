<script>
    import router from 'page';

    import { userActive } from './stores.js';

    import {isUserInGroup, isUserValid, signOutUser} from './services/cognito.js';

    let closed = true;

    const adminHandler = () => {
        router('/admin');
    };

    const signOutHandler = () => {
        signOutUser();
        $userActive = false;
        router('/');
    };
</script>

<header>
    <h1><a href="/">CardTracker</a></h1>
    <span class="right hamburger" on:click="{_ => closed = !closed}" />
    <span id="actions" class:closed>
        {#if $userActive && isUserInGroup('admin')}<button on:click="{adminHandler}">Admin</button>{/if}
        {#if $userActive}<button on:click="{signOutHandler}">Sign Out</button>{/if}
    </span>
</header>

<style>
    header {
        border-bottom: 1px solid #ccc;
        margin: 0px;
        padding: 0px 16px;
    }

    header h1 {
        display: inline;
    }
    @media only screen and (max-width: 700px) {
        .hamburger {
            background-image: url('/hamburger-1.png');
            background-repeat: no-repeat;
            width: 32px;
            height: 32px;
        }
        #actions {
            display: block;
            position: absolute;
            right: 8px;
            background-color: white;
            border: 1px solid #ccc;
            padding: 4px;
        }
        #actions.closed {
            display: none;
        }
    } 
</style>
