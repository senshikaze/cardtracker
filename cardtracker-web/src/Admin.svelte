<script>
    import CardList from './cards/CardList.svelte';
</script>

<CardList />
<div id="add-card">
    <a href="/admin/card/add" title="Add a card">+</a>
</div>

<style>
    #add-card {
        position: absolute;
        bottom: 24px;
        right: 24px;
        background-color: rgb(122, 173, 131);
        border-radius: 50%;
        width: 48px;
        height: 48px;
    }
    #add-card a {
        color: white;
        font-size: 48px;
        display: block;
        text-align: center;
        position: relative;
        top: -13px;
    }
    #add-card a:hover {
        text-decoration: none;
    }
</style>