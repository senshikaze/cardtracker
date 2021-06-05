<script>
    import {onMount} from 'svelte';
    import router from 'page';

    import {get_card, save_card, delete_card} from '../services/cards.js';

    import Toast from '../utils/Toast.svelte';

    export let params;
    let card;
    let edit = true;

    let toast;

    $: setTimeout(_ => toast = null, 15000);

    const handleSave = _ => {
        // TODO save card
        save_card(card).then((response) => {
            if (response.error) {
                toast = {type: "error", message: response.message}
            } else {
                toast = {type: "good", message: `${(edit)?"Saved":"Added"} Card`}
                if (!edit) {
                    router(`/admin/card/${card.id}`);
                }
            }
        })
    };

    const handleDelete = _ => {
        if (confirm('Are you sure? This will PERMANETLY DELETE THIS CARD!')) {
            delete_card(card.id).then((response) => {
                if (response.error) {
                    toast = {type: 'bad', message: response.message};
                    return;
                }
                router('/admin');
            });
        }
    }

    onMount(async () => {
        if (params && params.id && params.id !== 0) {
            get_card(params.id).then((response) => {
                card = response;
            });
        } else {
            edit = false;
            card = {
                id:  "", name: "",
                position: "", team: "",
                manufacturer: "", year: "",
                series: "", set: "",
                cardnumber: "", tcdb: "", sortnumber: 0
            }
        }
    });
</script>

{#if card}
<div>
    {#if toast}<Toast {...toast} />{/if}
    <label for="id">Card ID</label>
    <input id="id" name="id" bind:value="{card.id}" disabled={edit} />
    <label for="cardnumber">Card Number</label>
    <input id="cardnumber" name="cardnumber" bind:value="{card.cardnumber}" />
    <label for="name">Name</label>
    <input id="name" name="name" bind:value="{card.name}" />
    <label for="position">Position</label>
    <input id="position" name="position" bind:value="{card.position}" />
    <label for="year">Year</label>
    <input id="year" name="year" bind:value="{card.year}" />
    <label for="team">Team</label>
    <input id="team" name="team" bind:value="{card.team}" />
    <label for="manufacturer">Manufacturer</label>
    <input id="manufacturer" name="manufacturer" bind:value="{card.manufacturer}" />
    <label for="series">Series</label>
    <input id="series" name="series" bind:value="{card.series}" />
    <label for="tcdb">TCDB Link</label>
    <input id="tcdb" name="tcdb" bind:value="{card.tcdb}" />
    <label for="sortnumber">Sort Number</label>
    <input id="sortnumber" name="sortnumber" bind:value="{card.sortnumber}" type="number" />
    <input id="save" name="save" type="submit" value="Save" on:click="{handleSave}" />
    {#if edit}<input id="delete" name="delete" type="submit" value="Delete" on:click="{handleDelete}" />{/if}
</div>
{/if}

<style>
    input {
        width: 40%;
    }
</style>
