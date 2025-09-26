<script>
	let { figures = [], components } = $props();
</script>

{#each figures as { type, value }}
	{@const C = components[type]}
	{#if C}
		<C {...value} />
	{/if}
{/each}

<style>
</style>
