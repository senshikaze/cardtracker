<script>
    export let title;
    export let percent;
</script>
<span class="cont" title="{title}"><span style="width:{percent}%" /></span>
<style>
    .cont {
        background-color: #ccc5;
        width: 100px;
        display: inline-block;
        height: 18px;
    }
    .cont span {
        background-color: rgb(12, 125, 193);
        display: inline-block;
        min-height: 100%;
    }
</style>