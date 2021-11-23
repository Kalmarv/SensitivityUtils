<script>
import Random from "./Random.svelte";
import Home from "./Home.svelte";
let page = document.location.hash;
window.onpopstate = function(event) {
    page = document.location.hash;
};
</script>

<main>
    <div class="row">
        <div class="column">
            <h1>Menu</h1>
            <a href="#home">Home</a>
            <a href="#random">Random Sensitvity</a>
        </div>
        <div class="column">
            {#if page==="#home"}
            <Home />
            {:else if page === "#random"}
            <Random />
            {:else}
            404: Page not Found
            {/if}
        </div>
    </div>
</main>

<style>
.row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}

.column {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
}
</style>
