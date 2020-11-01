<script lang="ts">
  import type { Context, Modes } from '../../types';

  import { getContext } from 'svelte';
  import Button from '../Button.svelte';

  export let modes: Modes;

  let context = getContext<Context>('context');
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
            {context.i18n.get('creatorModeDescription')}
          {:else if mode === 'deterministic'}{context.i18n.get('deterministicModeDescription')}{/if}
        </p>
        <div class="text-center">
          <Button on:click={() => context.mode.set(mode)}>Select</Button>
        </div>
      </div>
    {/each}
  </div>
</div>
