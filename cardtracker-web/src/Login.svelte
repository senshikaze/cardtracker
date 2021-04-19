<script>
    import {createEventDispatcher} from 'svelte';
    import {fade} from 'svelte/transition';
    import {signIn, resetPassword} from './services/cognito.js';

    const dispatch = createEventDispatcher();

    let email;
    let password;

    let error;
    let good;
    let info;

    let passwordReset;
    let resetSession;
    let password_one;
    let password_two;
    
    const loginHandler = async () => {
        if (!email || !password) {
            error = "Must include username and password!";
            setTimeout((_) => error = null, 30000);
            return;
        }
        await signIn(email, password).then((response) => {
            if (response.statusCode == 419) {
                // we need to force a password reset
                password = null;
                passwordReset = true;
                info = "You must reset your password";
                error = null;
                resetSession = response.response;
                return;
            } else if (response.statusCode != 200) {
                error = response.response;
                setTimeout((_) => error = null, 30000);
                return
            }
            dispatch('message', {
                success: true,
                text: 'logged in'
            });
        });
    };

    const changePasswordHandler = async () => {
        if (!password_one || !password_two) {
            error = "Could not reset due to missing values";
            setTimeout((_) => error = null, 30000);
            passwordReset = false;
            password_one = password_two = null;
            return;
        }
        if (password_one !== password_two) {
            error = "Passwords cannot be empty!";
            setTimeout((_) => error = null, 30000);
            password_one = password_two = null;
            return;
        }
        resetPassword(resetSession.user, password_one, resetSession.userAttr).then((response) => {
            if (response.statusCode != 200) {
                error = response.response;
                password_one = password_two = null;
                return;
            }
            error = null;
            good = response.response;
            setTimeout((_) => good = null, 30000);
            resetSession = password_one = password_two = info = null;
            passwordReset = false;
            dispatch('message', {
                success: true,
                text: 'logged in'
            });
        });

    };
</script>

<div id="loginContainer">
    <div id="loginBox">
        {#if info}<p class="info" transition:fade>{info}</p>{/if}
        {#if error}<p class="error" transition:fade>{error}</p>{/if}
        {#if good}<p class="good" transition:fade>{good}</p>{/if}
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