<script lang="ts">
  import Home from './components/Home.svelte'
  import Current from './components/Current.svelte'
  import Navbar from './components/Navbar.svelte'
  import Random from './components/Random.svelte'

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

      <a href="https://github.com/Kalmarv/Synify" class="text-gray-400 hover:text-white">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          ><path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd"
          /></svg
        >
      </a>
    </div>
  </div>
</footer>
