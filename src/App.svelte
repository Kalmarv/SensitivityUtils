<script lang="ts">
  import Home from './components/Home.svelte'
  import Current from './components/Current.svelte'
  import Navbar from './components/Navbar.svelte'
  import Random from './components/Random.svelte'
  import Convert from './components/Convert.svelte'

  let page = document.location.hash
  window.onpopstate = (event: PopStateEvent) => {
    page = document.location.hash
  }
</script>

<div class="drawer">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="w-full navbar bg-base-300">
      <div class="flex-none lg:hidden">
        <label for="my-drawer-3" class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current"
            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg
          >
        </label>
      </div>
      <div class="flex-1 px-2 mx-2">Calculators</div>
      <div class="flex-none hidden lg:block">
        <ul class="menu menu-horizontal">
          <Navbar />
        </ul>
      </div>
    </div>
    {#if page === '#home'}
      <Home />
    {:else if page === '#current'}
      <Current />
    {:else if page === '#convert'}
      <Convert />
    {:else if page === '#random'}
      <Random />
    {:else}
      <Home />
    {/if}
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" class="drawer-overlay" />
    <ul class="menu p-4 overflow-y-auto w-80 bg-base-100">
      <Navbar />
    </ul>
  </div>
</div>
<footer class="fixed bottom-0 footer footer-center p-4 bg-base-300 text-base-content">
  <div class="flex items-center justify-between">
    <div class="flex space-x-6 mt-0">
      <p>
        Made by
        <a href="https://github.com/Kalmarv" class="link link-hover">Kalmarv</a> with ❤
      </p>
    </div>
  </div>
</footer>
