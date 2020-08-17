<script lang="ts">
  import clsx from 'clsx';

  export let variant: 'primary' | 'secondary';

  let className: string;
  export { className as class };
</script>

<style lang="postcss">
  .vtrs-btn {
    @apply flex items-center justify-center rounded shadow w-full text-white h-10 leading-none border-none transition-all ease-in duration-150;
  }

  .vtrs-btn--primary {
    @apply bg-green-600 font-semibold text-white;

    &:hover {
      @apply bg-green-700;
    }
  }

  .vtrs-btn--secondary {
    @apply bg-gray-800;

    &:hover {
      @apply bg-gray-900;
    }
  }
</style>

<button
  class={clsx('vtrs-btn', variant === 'primary' && 'vtrs-btn--primary', variant === 'secondary' && 'vtrs-btn--secondary', className)}>
  <slot />
</button>
