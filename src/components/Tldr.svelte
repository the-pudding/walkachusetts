<script>
	let { figures, components } = $props();
</script>

{#each figures as { type, value }}
	{@const C = components[type]}
	<div class="f">
		{#if C}
			<C {...value} />
		{/if}
	</div>
{/each}
