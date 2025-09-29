<script>
	const { src, alt, caption, top, bottom } = $props();
	const video = src.endsWith(".mp4");
	const illo = src.endsWith(".png");

	const styles = `${top ? `margin-top: ${top};` : ""} ${
		bottom ? `margin-bottom: ${bottom};` : ""
	}`;
</script>

<figure class:video class:illo style={styles}>
	<!-- {#if caption}
		<figcaption>{@html caption}</figcaption>
	{/if} -->
	{#if video}
		<video autoplay loop muted playsinline>
			<source {src} type="video/mp4" />
		</video>
	{:else}
		<img {src} {alt} />
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
		margin: 2em auto;
		position: relative;
		padding: 1em;
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
</style>
