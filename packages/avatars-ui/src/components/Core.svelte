<script lang="ts">
  import Button from './Button.svelte';
  import Card from './Card.svelte';
  import Select from './Select.svelte';
</script>

<div class="w-44 flex-grow-0 mr-5 flex flex-col justify-between">
  <div>
    <Card class="mb-5">
      <img src="https://avatars.dicebear.com/api/male/.svg" alt="generated avatar" class="w-full inline-block" />
    </Card>
    <Select class="mb-1">
      <option>pixel-art</option>
    </Select>
    <div class="text-center">
      <button class="text-xs text-gray-500 hover:underline">Switch to Creator Mode</button>
    </div>
  </div>
  <div>
    <Button variant="secondary" class="mb-2">Open in HTTP-API</Button>
    <Button variant="primary">Download SVG</Button>
  </div>
</div>
<div class="flex-grow">
  <Card class="h-full" />
</div>
