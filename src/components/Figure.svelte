<script>
	const { src, alt, caption, side, top, bottom, align, cl } = $props();
	const video = src.endsWith(".mp4");
	const illo = src.endsWith(".png");
	const mini = src.includes("mini-");
	const feature = src.includes("feature");

	const style = `${top ? `--top: ${top}px;` : ""}${bottom ? `--bottom: ${bottom}px;` : ""}`;
</script>

<figure
	class:feature
	class:video
	class:illo
	class:mini
	class="{side} {align} {cl}"
	{style}
>
	<!-- {#if caption}
		<figcaption>{@html caption}</figcaption>
	{/if} -->
	{#if video}
		<video loop muted playsinline preload="metadata">
			<source {src} type="video/mp4" />
		</video>
	{:else}
		<img {src} {alt} loading="lazy" />
	{/if}
	{#if !illo}
		<img class="frame" src="assets/illos/frame.png" alt="" aria-hidden="true" />
	{/if}
</figure>

<style>
	figure {
		display: block;
		width: 100%;
		max-width: 360px;
		margin: 3em auto;
		position: relative;
		padding: 8px;
	}

	figure.illo {
		padding: 0;
	}

	img {
		width: 100%;
	}

	img.frame {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		user-select: none;
	}

	@media screen and (min-width: 1000px) {
		figure.illo {
			padding: 8px 0;
			margin: 0;
		}

		figure.feature {
			position: relative;
			left: 50%;
			max-width: none !important;
			width: 640px !important;
			margin: 2em auto !important;
			transform: translate(-50%, 0);
			top: var(--top, auto);
			bottom: var(--bottom, auto);
		}
	}
</style>
