<script lang="ts">
  import Card from './Card.svelte';

  export let variant: 'primary' | 'secondary';

  let className: string;
  export { className as class };
</script>

<style lang="postcss">
  select {
    @apply h-10 px-3 appearance-none block border-none w-full cursor-pointer;
  }
</style>

<Card class={className}>
  <select>
    <slot />
  </select>
</Card>
