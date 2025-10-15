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
		--gap: 0.25rem;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: flex-start;
		padding: 1rem;
		margin: 0 auto;
		max-width: calc(360px * 1);
		gap: var(--gap);
	}

	.f {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		align-self: stretch;
		justify-content: center;
		width: 100%;
		margin: 0;
		max-width: none;
		padding: 0;
		font-family: var(--sans);
		color: var(--color-bg);
		aspect-ratio: 640/853;
	}

	@media screen and (min-width: 600px) {
		.stepper {
			max-width: calc(360px * 2);
		}
		.f {
			width: calc(50% - var(--gap));
		}
	}

	@media screen and (min-width: 950px) {
		.stepper {
			max-width: calc(360px * 3);
		}
		.f {
			width: calc(33.33% - var(--gap));
		}
	}

	@media screen and (min-width: 1200px) {
		.stepper {
			max-width: calc(360px * 4);
		}
		.f {
			width: calc(25% - var(--gap));
		}
	}

	@media screen and (min-width: 1600px) {
		.stepper {
			--gap: 0.5rem;
		}
		.f {
			width: calc(20% - var(--gap));
		}
	}
</style>
