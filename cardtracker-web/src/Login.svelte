<script>
    import router from 'page';

    import {signIn, resetPassword} from './services/cognito.js';

    import Toast from './utils/Toast.svelte';
    let toast;
    $: setTimeout(_ => toast = null, 30000);

    let email;
    let password;

    let passwordReset;
    let resetSession;
    let password_one;
    let password_two;
    
    const loginHandler = async () => {
        if (!email || !password) {
            toast = {type: 'error', message: "Must include username and password!"};
            return;
        }
        await signIn(email, password).then((response) => {
            if (response.statusCode == 419) {
                // we need to force a password reset
                password = null;
                passwordReset = true;
                resetSession = response.response;
                return;
            } else if (response.statusCode != 200) {
                toast = {type: 'error', message: response.message}
                return
            }
            router('/');
        });
    };

    const changePasswordHandler = async () => {
        if (!password_one || !password_two) {
            passwordReset = false;
            password_one = password_two = null;
            return;
        }
        if (password_one !== password_two) {
            password_one = password_two = null;
            return;
        }
        resetPassword(resetSession.user, password_one, resetSession.userAttr).then((response) => {
            if (response.statusCode != 200) {
                password_one = password_two = null;
                return;
            }
            resetSession = password_one = password_two = null;
            passwordReset = false;
        });
        router('/');
    };
</script>

<div id="loginContainer">
    <div id="loginBox">
        {#if toast}<Toast {...toast} />{/if}
        {#if passwordReset}
            <label for="password_one">New Pasword</label>
            <input id="password_one" name="password_one" type="password" bind:value="{password_one}" />
            <label for="password_two">Verify Pasword</label>
            <input id="password_two" name="password_two" type="password" bind:value="{password_two}" />
            <input type="submit" value="Change Password" on:click="{changePasswordHandler}" />
        {:else}
            <label for="username">Email</label>
            <input id="username" name="username" bind:value="{email}" />
            <label for="password">Pasword</label>
            <input id="password" name="password" type="password" bind:value="{password}" />
            <input type="submit" value="Login" on:click="{loginHandler}" />
        {/if}
    </div>
</div>

<style>
    #loginContainer {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(33, 33, 33 , 0.8);
    }
    #loginBox {
        padding: 24px;
        position: relative;
        top: 30%;
        left: calc(50% - (200px));
        width: 400px;
        min-height: 175px;
        background-color: white;
    }
    #loginBox * {
        margin: 4px 0px;
    }
    #loginBox input {
        width: 100%;
    }
</style>