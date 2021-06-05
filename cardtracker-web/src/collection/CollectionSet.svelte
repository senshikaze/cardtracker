<script>
    import ProgressBar from '../utils/ProgressBar.svelte';

    import { collection, sets } from '../stores.js';
    import { add_collection_card, delete_collection_card, get_collection_card } from '../services/cards.js';
    import { cardTitle, setTitle } from '../services/strings.js';

    import Toast from '../utils/Toast.svelte';

    let collectedSets = [];
    let toast;
    let filter = "";

    // add card to collection
    const changeCard = (card) => {
        let collectionCard = {
            id: "", card: card,
            account: "", count: "1",
            collected: new Date().toISOString().split('T')[0],
            frontPath: "", backPath: "", added: "", variant: "",
            parallel: "", parallelnumber: "", public: false
        }
        if (haveCard(card)) {
            // we have this card. Remove it.
            // FIXME technically, can have more than 1 (variants/parallels)
            let collectionCard = $collection.filter(x => x.card.id == card.id)[0];
            if (!collectionCard){
                toast = {type: 'error', message: `Could not find collected ${card.id}`};
                return;
            }
            delete_collection_card(collectionCard).then(response => {
                if (response.error) {
                    toast = {type: 'error', message: `Error deleting: ${response.error}`};
                    return;
                }
                collection.update(x => x.filter(y => y.id != response.deleted));
            });
        } else {
            // we do not have this card. Add it.
            add_collection_card(collectionCard).then(response => {
                if (response.error) {
                    toast = {type: "error", message: response.message};
                    return;
                }
                // get the newly create collected card
                get_collection_card(response.id).then((result) => {
                    if (result.error) {
                        toast = {type: "error", message: result.message};
                        return;
                    }
                    collection.update(x => [...x, result]);
                });  
            });
        }
    };

    // Slide 
    const expandSlider = (event) => {
        let sibling = event.target.nextElementSibling;
        sibling.classList.toggle('closed');
    };

    // do we have a copy of this card?
    const haveCard = (card) => {
        return $collection.filter(x => x.card.id == card.id).length > 0
    };

    // hide collected cards
    const hideCollected = (event) => {
        let listEl = event.target.closest('.setTitle').nextElementSibling;
        listEl.querySelectorAll('li').forEach(el => {
            if (el.querySelector('input').checked && event.target.checked) {
                el.classList.add('hidden');
            } else if (!event.target.checked) {
                el.classList.remove('hidden');                    
            }
        });
    };

    // how many cards from this set are in our collection
    const setCount = (set) => {
        return $collection.filter(x => setTitle(x.card) == set).length
    };

    $: {
        // go over the sets of the cards we have
        // and create a map between the global sets
        // and our collection into collectionSets
        collectedSets = new Set([...$collection.map(x => setTitle(x.card))]);
    }

    $: {
        let cards = document.querySelectorAll('.card');
        cards.forEach(el => {
            let dataCardTitle = el.getAttribute('data-cardtitle');
            if (!dataCardTitle.toLowerCase().includes(filter.toLowerCase())) {
                el.classList.add('hidden');
            } else {
                el.classList.remove('hidden');
            }
        });
    }    
</script>

<Toast {...toast} />
<div class="pageHeader">
    <h3>My Sets</h3>
    <div class="actions">
        <input bind:value={filter} />
    </div>
</div>
<div>
{#each [...collectedSets] as setName}
    <h4 class="accordion setTitle" on:click="{expandSlider}">
        {setName} 
        <ProgressBar title="({setCount(setName)}/{$sets[setName].length})" percent={(setCount(setName)/$sets[setName].length)*100} />
        <label for="hideCollected" class="hideLabel"><input type="checkbox" on:click="{hideCollected}" />Hide Collected</label>
    </h4>
    <ul class="slider closed">
    {#each $sets[setName] as setCard}
        <li title="{setCard.id}" class="card" data-cardtitle="{cardTitle(setCard)}">
            <input type="checkbox" checked={haveCard(setCard)} on:click="{changeCard(setCard)}" />{cardTitle(setCard)} (#{setCard.cardnumber})
        </li>
    {/each}
    </ul>
{/each}
</div>

<h3 class="accordion" on:click="{expandSlider}">All Sets</h3>
<div class="slider closed">
{#each Object.keys($sets) as cardSet}
    <h4 class="accordion" on:click="{expandSlider}">{cardSet}</h4>
    <ul class="slider closed">
        {#each $sets[cardSet] as card}
            <li title="{card.id}" class="card" data-cardtitle="{cardTitle(card)}">
                <input type="checkbox" checked={haveCard(card)} on:click="{changeCard(card)}" />{cardTitle(card)}
            </li>
        {/each}
    </ul>
{/each}
</div>

<style>
    h4 {
        font-size: 17px;
    }
    input[type=checkbox] {
        padding: 0px;
        margin: 0px;
        width: auto;
        margin-right: 4px;
    }
    li {
        border-bottom: 1px solid #ccc;
        padding: 12px 0px;
    }

    .pageHeader h3 {
        display: inline;
    }
    .pageHeader .actions {
        float: right;
    }
    .pageHeader .actions input {
        width: auto;
    }

    .accordion {
        cursor: pointer;
        border-bottom: 1px solid #ccc;
    }
    .slider {
        overflow-y: hidden;
        max-height: 50000px;
        transition: all .8s cubic-bezier(0, 1, 0.5, 1);
    }
    .slider.closed {
        max-height: 0;
        transition: all .5s cubic-bezier(0, 1, 0.5, 1);
    }
    .hideLabel {
        display: inline;
    }
</style>