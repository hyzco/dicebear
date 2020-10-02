<script lang="ts">
  export let variant: 'primary' | 'secondary';

  let className: string;
  export { className as class };
</script>

<style lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  button {
    @apply flex items-center justify-center rounded shadow w-full text-white h-10 leading-none border-none transition-all ease-in duration-150;
  }

  .primary {
    @apply bg-green-600 font-semibold text-white;

    &:hover {
      @apply bg-green-700;
    }
  }

  .secondary {
    @apply bg-gray-800;

    &:hover {
      @apply bg-gray-900;
    }
  }
</style>

<button class="{variant}">
  <slot />
</button>
