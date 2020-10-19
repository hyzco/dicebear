<script lang="ts">
  import type { Modes, TransContext, ModeContext } from '../../types';
  import { getContext } from 'svelte';
  import Button from '../Button.svelte';

  export let modes: Modes;

  $: trans = getContext<TransContext>('trans');
  $: modeCtx = getContext<ModeContext>('mode');
</script>

<style>
  /** Scenes/Mode (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="p-12">
  <div class="grid grid-cols-cards gap-10">
    {#each modes as mode}
      <div class="p-6 bg-gray-100 text-center rounded flex flex-col">
        <h2 class="text-xl mb-6 text-gray-700 capitalize">{mode}</h2>
        <p class="text-gray-600 mb-8 flex-grow">
          {#if mode === 'creator'}
            {trans.creatorModeDescription}
          {:else if mode === 'deterministic'}{trans.deterministicModeDescription}{/if}
        </p>
        <div class="text-center">
          <Button on:click={() => modeCtx.set(mode)}>Select</Button>
        </div>
      </div>
    {/each}
  </div>
</div>
