<script>
    export let href;
    export let title;
</script>

<div id="add-card">
    <a href="{href}" title="{title}">+</a>
</div>

<style>
    #add-card {
        position: fixed;
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
        top: -4px;
    }
    #add-card a:hover {
        text-decoration: none;
    }
</style>