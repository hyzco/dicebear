<script lang="ts">
  import type { Context, Modes } from '../../types';

  import { getContext } from 'svelte';
  import Button from '../Button.svelte';

  export let modes: Modes;

  let ctx = getContext<Context>('ctx');
</script>

<style>
  /** Scenes/Mode (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="grid grid-cols-cards gap-6 sm:gap-8 md:gap-10 lg:gap-12">
  {#each modes as mode}
    <div class="p-6 bg-gray-100 text-center rounded flex flex-col">
      <h2 class="text-xl mb-6 text-gray-700 capitalize">{mode}</h2>
      <p class="text-gray-600 mb-8 flex-grow">
        {#if mode === 'creator'}
          {ctx.i18n.get('creatorModeDescription')}
        {:else if mode === 'deterministic'}{ctx.i18n.get('deterministicModeDescription')}{/if}
      </p>
      <div class="text-center">
        <Button on:click={() => ctx.mode.set(mode)}>Select</Button>
      </div>
    </div>
  {/each}
</div>
