<script lang="ts">
  import type { Mode, Styles } from '../types';
  import Core from './Core.svelte';
  import Card from './Card.svelte';

  export let withWrapper = true;
  export let mode: Mode = ['creator', 'seed'];
  export let styles: Styles;
</script>

<style type="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="container mx-auto">
  {#if withWrapper}
    <Card variant="secondary" size="large" class="p-5 h-128 flex text-sm">
      <Core {mode} {styles} />
    </Card>
  {:else}
    <Core {mode} {styles} />
  {/if}
  <p class="text-right p-1 text-xs text-gray-400">
    Powered by <a href="https://avatars.dicebear.com/" target="_blank" class="font-medium hover:underline"> DiceBear
      Avatars</a>
  </p>
</div>
