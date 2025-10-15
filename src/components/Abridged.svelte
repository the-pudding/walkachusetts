<script>
	import lookupFigure from "$utils/lookupFigure.js";
	import Figure from "$components/Figure.svelte";
	import { getContext } from "svelte";
	const data = getContext("data");
	const { text, image, w } = $props();
</script>

<div class="abridged">
	<div class="abridged-illo" style="--img-w: {w};">
		<Figure {...lookupFigure(image, data.media, data.dimensions)} />
	</div>
	<p class="text-outline">{@html text}</p>
</div>

<style>
	.abridged {
		position: relative;
		align-self: stretch;
		height: 100%;
	}

	p {
		font-size: var(--16px);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 8px;
		margin: 0;
		--color-text-outline: var(--color-black);
		position: relative;
	}

	:global(.abridged span) {
		text-shadow: none;
	}

	.abridged-illo {
		/* invert color */
		filter: invert(0.6);
		width: 75%;
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		z-index: 0;
	}

	@media screen and (min-width: 900px) {
		p {
			font-size: var(--16px);
		}
	}
</style>
