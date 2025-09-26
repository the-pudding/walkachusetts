<script>
	const { src, alt, caption } = $props();
	const video = src.endsWith(".mp4");
</script>

<figure class:video>
	{#if video}
		<video autoplay loop muted playsinline>
			<source {src} type="video/mp4" />
		</video>
	{:else}
		<img {src} {alt} />
	{/if}
	{#if caption}
		<figcaption>{@html caption}</figcaption>
	{/if}
</figure>

<style>
	figure {
		display: block;
		width: 100%;
		max-width: 360px;
		margin: 2em auto;
	}

	figcaption {
		display: none;
		font-size: var(--14px);
		text-align: center;
		margin-top: 8px;
		line-height: 1.2;
	}
</style>
