<script>
	const { lines } = $props();
</script>

<div class="bit">
	{#each lines as line}
		<p>{@html line}</p>
	{/each}
</div>

<style>
	p {
		font-size: var(--14px);
		font-family: var(--sans);
		margin: 0.5rem 0 !important;
	}
</style>
