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
    
    let yaw = 0.0066;
    let precision = 2;
    
    let cm = 28.86
    
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
    
    function convertSens() {
        cm = Number.parseFloat(realCM(sens)).toFixed(2)
    }
    
    function realCM(inputSens) {
        return (360 * 2.54) / (inputSens * dpi * yaw)
    }
    </script>
    
    <main>
        <div>
            <h1>Calculate Current Sensitivity</h1>
        </div>
        <div>
            <div>
                {#if !custom.yaw}
                <select bind:value on:change={setGame}>
                    {#each items as item}
                    <option value={item}>{item}</option>
                    {/each}
                </select>
                {/if}
                {#if custom.yaw}
                    <p>Yaw:</p>
                    <input type="text" bind:value={yaw} on:input={convertSens} size="2" />
                {/if}
                <div>
                    <button on:click={toggle} on:click={setGame}>Use Custom Yaw</button>
                </div>
            </div>
            <div>
                <p>Current Sensitivity:</p>
                <input type="text" bind:value={sens} on:input={convertSens} size="1" />
            </div>
            <div>
                <p>DPI:</p>
                <input type="text" bind:value={dpi} on:input={convertSens} size="1" />
            </div>
            <div>
                <h3>Sensitivty: {cm} cm/360</h3>
            </div>
        </div>
    </main>
    
    <style>
    </style>
    