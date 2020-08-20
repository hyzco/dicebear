<script lang="ts">
  import type { Mode, Styles } from '../types';
  import type * as Avatars from '@dicebear/avatars';
  import Theme from './Theme.svelte';
  import Core from './Core.svelte';
  import Card from './Card.svelte';

  export let withWrapper = true;
  export let mode: Mode = ['creator', 'seed'];
  export let styles: Styles;
</script>

<Theme>
  <div class="container mx-auto">
    {#if withWrapper}
      <Card variant="secondary" size="large" class="p-5 h-128 flex text-sm">
        <Core />
      </Card>
    {:else}
      <Core />
    {/if}
    <p class="text-right px-1">
      <a href="https://avatars.dicebear.com/" target="_blank" class="text-xs text-gray-400 hover:underline">
        Powered by
        <span class="font-medium">DiceBear Avatars</span>
      </a>
    </p>
  </div>
</Theme>
