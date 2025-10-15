<script>
	let { figures, components } = $props();
</script>

<section class="stepper">
	{#each figures as { type, value }}
		{@const C = components[type]}
		<div class="f">
			{#if C}
				<C {...value} />
			{/if}
		</div>
	{/each}
</section>

<style>
	.stepper {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
	}

	.f {
		flex: 1 1 300px;
		max-width: 50%;
		padding: 8px;
		box-sizing: border-box;
	}

	@media (max-width: 600px) {
		.f {
			max-width: 100%;
		}
	}
</style>
