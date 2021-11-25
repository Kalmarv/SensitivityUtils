<script>
let games_dic = {
    Overwatch: [0.0066, 2],
    Fortnite: [0.005555, 3],
    CounterStrike: [0.022, 2],
    QuakeChampions: [0.022, 6],
};

let value = "Overwatch";
let items = ["Overwatch", "Fortnite", "CounterStrike", "QuakeChampions"];
let sens = 6;
let dpi = 800;
let lower = 20;
let higher = 40;

let yaw = 0.0066;
let precision = 2;

let randNumRounded = 28.86

let custom = { yaw: false }; 

function toggle() {
    custom.yaw = !custom.yaw;
}

function setGame() {
    for (const [key, values] of Object.entries(games_dic)) {
        if (key == value) {
            yaw = values[0];
            precision = values[1];
        }
    }
}

function genSens() {
    let randNum =
        Number(lower) + Math.random() * (Number(higher) - Number(lower));
    let unrounded = (360 * 2.54) / (randNum * Number(dpi) * yaw);
    sens = Number.parseFloat(unrounded).toFixed(precision);
    randNumRounded = Number.parseFloat(realCM(sens)).toFixed(2)
}

function realCM(inputSens) {
    return (360 * 2.54) / (inputSens * dpi * yaw)
}
</script>

<main>
    <div>
        <h1>Random Sensitivity Generator</h1>
    </div>
    <div>
        <div>
            <h3>Generate Random Sensitivity for:</h3>
            {#if !custom.yaw}
            <select bind:value on:change={setGame}>
                {#each items as item}
                <option value={item}>{item}</option>
                {/each}
            </select>
            {/if}
            {#if custom.yaw}
                <p>Yaw:</p>
                <input type="text" bind:value={yaw} size="2" />
            {/if}
            <div>
                <button on:click={toggle} on:click={setGame}>Use Custom Yaw</button>
            </div>
        </div>
        <div>
            <p>DPI:</p>
            <input type="text" bind:value={dpi} size="1" />
            <p>Min:</p>
            <input type="text" bind:value={lower} size="1" />
            <p>Max:</p>
            <input type="text" bind:value={higher} size="1" />
        </div>
        <div>
            <button on:click={genSens}>Generate Sensitivity</button>
        </div>
        <div>
            <p>Your sensitivity is: {sens}</p>
            <p>({randNumRounded} cm/360)</p>
        </div>
    </div>
</main>

<style>
</style>
