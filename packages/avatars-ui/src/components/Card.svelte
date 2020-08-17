<script lang="ts">
  import clsx from 'clsx';

  export let variant: 'primary' | 'secondary' = 'primary';
  export let size: 'medium' | 'large' = 'medium';

  let className: string;
  export { className as class };
</script>

<style lang="postcss">
  .vtrs-card {
    @apply rounded bg-white shadow overflow-hidden;
  }

  .vtrs-card--secondary {
    @apply bg-gray-300;
  }

  .vtrs-card--large {
    @apply rounded-lg;
  }
</style>

<div
  class={clsx('vtrs-card', size === 'large' && 'vtrs-card--large', variant === 'secondary' && 'vtrs-card--secondary', className)}>
  <slot />
</div>
