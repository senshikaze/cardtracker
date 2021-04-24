<script>
    import {save_collection_image} from '../services/cards.js';

    import Toast from '../utils/Toast.svelte';
    let toast;
    $: setTimeout(_ => toast = null, 30000);

    export let card;
    let frontImage;
    let backImage;

    $: {
        let image;
        let files;
        if (frontImage) {
            // upload front image
            image = {
                imageName: frontImage[0].name,
                side: "front"
            }
            files = frontImage;
        }
        if (backImage) {
            // upload back image
            image = {
                imageName: backImage[0].name,
                side: "back"
            }
            files = backImage;
        }
        if (image && files) {
            save_collection_image(card, image, files).then((response) => {
                backImage = frontImage = null;
                if (response.error) {
                    toast = {type: "error", message: response.message};
                    return;
                }
                card[response.side] = response.newURL;
            });
        }
    }
</script>

<div class="card_images">
    <Toast {...toast} />
    <div class="image" title="Front of card">
        <p>Front</p>
        {#if card.frontPath}<img src="{card.frontPath}" alt="{card.card.id} front" />{/if}
        <span class="image_button">
            <input id="frontFile" type="file" bind:files="{frontImage}" />
            <label for="frontFile"><img src="/add_image.png" alt="Upload front of card" /></label>
        </span>
    </div>
    <div class="image" title="Back of card">
        <p>Back</p>
        {#if card.backPath}<img src="{card.backPath}" alt="{card.card.id} back" />{/if}
        <span class="image_button">
            <input id="backFile" type="file" bind:files="{backImage}" />
            <label for="backFile"><img src="/add_image.png" alt="Upload back of card" /></label>
        </span>
    </div>
</div>

<style>
    .card_images { 
        float: left;
        width: 60%;
    }

    .image {
        width: 250px;
        height: 350px;
        border: 1px solid rgb(58, 58, 58);
        position: relative;
        float: left;
        margin: 8px;
    }

    .image::after {
        clear: both;
    }

    .image p {
        color: rgba(73, 73, 73, 0.1);
        display: inline;
        position: absolute;
        top: 4px;
        left: 4px;
        z-index: 100;
        margin: 0px;
    }

    .image:hover p {
        color: rgba(73, 73, 73, 0.85);
    }

    .image img {
        width: 250px;
        height: 350px;
        z-index: 50
    }

    .image_button {
        position: absolute;
        bottom: 4px;
        right: 4px;
        z-index: 100;
    }
    .image_button:hover {
        background-color: rgba(204, 204, 204, 0.8);
    }

    .image_button img{
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    .image_button label {
        display: inline;
        border: none;
    }

    input[type=file] {
        display: none;
    }

    @media only screen and (max-width: 700px) {
        .card_images { 
            width: 100%;
        }
        .image_button img {
            width: 48px;
            height: 48px;
            cursor: pointer;
        }
        .image_button:active {
        background-color: rgba(204, 204, 204, 0.8);
    }
    }
</style>