<script lang="ts">
  import Theme from './components/Theme.svelte';
  import Button from './components/Button.svelte';
  import Card from './components/Card.svelte';
  import Select from './components/Select.svelte';
</script>

<Theme>
  <div class="container mx-auto">
    <Card variant="secondary" size="large" class="p-5 h-128 flex text-sm">
      <div class="w-44 flex-grow-0 mr-5 flex flex-col justify-between">
        <div>
          <Card class="mb-5">
            <img src="https://avatars.dicebear.com/api/male/.svg" alt="generated avatar" class="w-full inline-block" />
          </Card>
          <Select class="mb-1">
            <option>pixel-art</option>
          </Select>
          <div class="text-center">
            <a href="" class="text-xs text-gray-500 hover:underline">Switch to Creator Mode</a>
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
    </Card>
    <p class="text-right px-1">
      <a href="https://avatars.dicebear.com/" target="_blank" class="text-xs text-gray-400 hover:underline">
        Powered by
        <span class="font-medium">DiceBear Avatars</span>
      </a>
    </p>
  </div>
</Theme>
