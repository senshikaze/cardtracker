<script>
    import {onMount} from 'svelte';
    import router from 'page';

    import {
        get_collection_card,
        add_collection_card,
        save_collection_card,
        delete_collection_card,
    } from '../services/cards.js';

    import CollectionCardCardItem from './CollectionCardCardItem.svelte';
    import CollectionCardImage from './CollectionCardImage.svelte';
    import Toast from '../utils/Toast.svelte';

    export let params;
    let edit = true;

    let card;

    let toast;
    $: setTimeout(_ => toast = null, 30000);

    const handleSave = _ => {
        if (card.id) {
            save_collection_card(card).then((response) => {
                if (response.error) {
                    toast = {type: "error", message: response.message};
                } else {
                    toast = {type: "good", message: "Saved"};
                }
            });
        } else {
            add_collection_card(card).then((response) => {
                if (response.error) {
                    toast = {type: "error", message: response.message};
                } else {
                    toast = {type: "good", message: "Added"};
                }
            });
        }
    }
    const handleMessage = (event) => {
        card.card = event.detail.card;
    };

    const handleDelete = _ => {
        delete_collection_card(card).then((response) => {
            if (response.error) {
                toast = {type: "error", message: response.message};
                return;
            }
            router('/collection');
        })
    };

    onMount(async () => {
        if (params && params.id && params.id !== 0) {
            get_collection_card(params.id).then((response) => {
                if (response.error) {
                    toast = {type: 'error', message: response.message};
                }
                card = response;
            });
        } else {
            edit = false;
            card = {
                id: "", account: "",
                card: null, count: "",
                collected: "", frontPath: "",
                backPath: "", added: "", variant: "", 
                parallel: "", parallelnumber: "", public: false
            }
        }
    });
</script>

<Toast {...toast} />
<a href='/collection' id="nav">&#60; Back</a>
{#if card}
<div class="card_info">
    <CollectionCardCardItem card="{card.card}" on:message="{handleMessage}" />
    <label for="count">Count</label>
    <input id="count" name="count" bind:value="{card.count}" type="number" />
    <label for="collected">Collected</label>
    <input id="collected" name="collected" bind:value="{card.collected}" type="date" />
    <div class="checkbox_wrap">
        <label for="variantcheck" class="checkbox_label">Variant?</label>
        <input id="variantcheck" name="variantcheck" checked="{card.variant}" type="checkbox" on:click="{_ => card.variant = (!card.variant)?'VAR':""}"/>
    </div>
    {#if card.variant}
        <input id="variant" name="variant" bind:value="{card.variant}" />
    {/if}
    <div class="checkbox_wrap">
        <label for="parallelcheck" class="checkbox_label">Parallel?</label>
        <input id="parallelcheck" name="parallelcheck" checked={card.parallel} type="checkbox" on:click="{_ => card.parallel = (!card.parallel)?'<Parallel>':""}"/>
    </div>
    {#if card.parallel}
        <label for="parallel">Parallel Type</label>
        <input id="parallel" name="parallel" bind:value="{card.parallel}" />
        <label for="parallelnumber">Parallel Number</label>
        <input id="parallelnumber" name="parallelnumber" bind:value="{card.parallelnumber}" />
    {/if}
    <div class="checkbox_wrap">
        <label for="public" class="checkbox_label">Make Public?</label>
        <input id="public" type="checkbox" name="public" bind:value="{card.public}" />
    </div>
    {#if card.id}
        <CollectionCardImage card="{card}" />
    {/if}
    <input type="submit" name="save" value="Save" on:click="{handleSave}" disabled={card.card==null} />
    {#if edit}<input type="submit" name="delete" id="delete" value="Delete" on:click="{handleDelete}" disabled={card.card==null} />{/if}
</div>
{/if}

<style>
    #nav {
        display: block;
        margin: 8px 0px;
    }
    .card_info {
        float: left;
        width: 50%;
        min-width: 30%;
    }
    input {
        width: 30%;
    }
    .card_info input {
        width: 100%;
    }
    .checkbox_label {
        display: inline-block;
        width: 30%;
    }
    input[type="checkbox"] {
        display: inline;
    }
    input[name="save"] {
        margin-top: 24px;
    }
    input[type="submit"]:disabled {
        cursor: not-allowed;
    }
    @media only screen and (max-width: 700px) {
        .card_info {
            width: 100%;
        }
        input {
            width: 100%;
        }
    }
</style>