
<script>
    import {fade} from 'svelte/transition';
    export let type;
    export let message;
</script>

<p class="{type}" transition:fade>{message}</p>

<style>
    /* color classes */
    .good {
        color: rgb(11, 179, 36);
    }

    .error {
        color: rgb(230, 59, 47);
    }

    .info {
        color: rgb(174, 184, 38);
    }
</style>