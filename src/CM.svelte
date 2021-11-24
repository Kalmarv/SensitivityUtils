<script>
import { onMount } from 'svelte';
onMount(() => {
    setGame(gameFrom, 0)
    setGame(gameTo, 1)
    convertSens()
})
let games_dic = {
    Overwatch: [0.0066, 2],
    Fortnite: [0.005555, 3],
    CounterStrike: [0.022, 2],
    QuakeChampions: [0.022, 6],
};

let gameFrom = "Overwatch"
let gameTo = "CounterStrike"
let items = ["Overwatch", "Fortnite", "CounterStrike", "QuakeChampions"];
let yaw = []
let precision = []
let dpi = 800
let sensFrom = 6
let sensTo
let realCMO

function setGame(valueToUpdate, i) {
    for (const [key, values] of Object.entries(games_dic)) {
        if (key == valueToUpdate) {
            yaw[i] = values[0];
            precision[i] = values[1];
        }
    }
}

function convertSens() {
    let tempSens = sensFrom * yaw[0] / yaw[1]
    sensTo = Number.parseFloat(tempSens).toFixed(precision[1])

    realCMO = Number.parseFloat(realCM(sensTo, dpi, yaw[1])).toFixed(2)
}

function realCM(inputSens, dpi, yaw) {
    return 914.4 / (inputSens * dpi * yaw)
}
</script>

<div>
    <h1>Convert Between Games</h1>
    <p>From:</p>
    <select bind:value={gameFrom} on:change={() => setGame(gameFrom, 0)}>
        {#each items as item}
        <option value={item}>{item}</option>
        {/each}
    </select>
    <p>Sens:</p>
    <input type="text" bind:value={sensFrom} on:change={convertSens} size="1" />
    <p>DPI: (for cm/360)</p>
    <input type="text" bind:value={dpi} on:change={convertSens} size="1" />
    <p>To:</p>
    <select bind:value={gameTo} on:change={() => setGame(gameTo, 1)}>
        {#each items as item}
        <option value={item}>{item}</option>
        {/each}
    </select>
    <div>
        <button on:click={convertSens}>Convert Sensitivity</button>
    </div>
    <p>{sensFrom} in {gameFrom} is {sensTo} in {gameTo}</p>
    <p>({realCMO} cm/360)</p>
</div>

<style>
</style>
