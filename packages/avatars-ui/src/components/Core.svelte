<script lang="ts">
  import * as avatars from '@dicebear/avatars';
  import type { Mode, Styles } from '../types';
  import Button from './Button.svelte';
  import Card from './Card.svelte';
  import Select from './Select.svelte';

  export let mode: Mode;
  export let styles: Styles;

  export let avatar = avatars.createAvatar(styles['micah']);
</script>

<div class="w-44 flex-grow-0 mr-5 flex flex-col justify-between">
  <div>
    <Card class="mb-5">
      {@html avatar}
    </Card>
    <Select class="mb-1">
      {#each Object.keys(styles) as styleName}
        <option>{styleName}</option>
      {/each}
    </Select>
    <div class="text-center"><button class="text-xs text-gray-500 hover:underline">Switch to Creator Mode</button></div>
  </div>
  <div>
    <Button variant="secondary" class="mb-2">Open in HTTP-API</Button>
    <Button variant="primary">Download SVG</Button>
  </div>
</div>
<div class="flex-grow">
  <Card class="h-full" />
</div>
