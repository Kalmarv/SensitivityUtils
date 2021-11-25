<script>
import Home from "./Home.svelte";
import Random from "./Random.svelte";
import CM from "./CM.svelte";
import FocalLength from "./FocalLength.svelte";
import FOV from "./FOV.svelte";
let page = document.location.hash;
window.onpopstate = function(event) {
    page = document.location.hash;
};
</script>

<main id="main">
    <div id="page">
        <div id="sidebar" class="pane">
            <h1>Menu</h1>
            <a href="#home">Home</a>
            <a href="#random">Random Sensitvity</a>
            <a href="#convertCM">Convert: Distance</a>
            <a href="#convertFL">Convert: Focal Length</a>
            <a href="#convertFOV">Convert: FOV</a>
        </div>
        <div id="content" class="pane">
            {#if page==="#home"}
            <Home />
            {:else if page === "#random"}
            <Random />
            {:else if page === "#convertCM"}
            <CM />
            {:else if page === "#convertFL"}
            <FocalLength />
            {:else if page === "#convertFOV"}
            <FOV />
            {:else}
            <Home />
            {/if}
        </div>
    </div>
</main>

<style>
#page {
    display: flex;
    height: 100vh;
}

.pane {
    padding-left: 20px;
}

#sidebar {
    display: flex;
    flex-direction: column;
    width: 200px;
    box-shadow: inset -10px 0 10px -5px hsla(0,0%,0%,.25)
}

#content {
    flex: 1 0 auto;
}
</style>
