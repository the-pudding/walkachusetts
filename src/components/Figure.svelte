<script>
	import inView from "$actions/inView.js";
	const {
		src,
		alt,
		caption,
		side,
		sidebar_order,
		top,
		bottom,
		align,
		w,
		h,
		cl,
		i
	} = $props();
	const video = src.includes("video");
	const illo =
		src.includes("illos") || src.includes("mobile") || src.includes("features");
	const feature = src.includes("feature");

	const style = `${top ? `--top: ${top}px;` : ""}${bottom ? `--bottom: ${bottom}px;` : ""}`;

	let el = $state(null);

	const frame = sidebar_order ? (sidebar_order % 5) + 1 : 1;

	function onenter() {
		if (el) el.play();
	}

	function onexit() {
		if (el) el.pause();
	}
</script>

<figure
	class:feature
	class:video
	class:illo
	class="{side} {align} {cl}"
	{style}
>
	{#if video}
		<video
			loop
			muted
			playsinline
			preload="metadata"
			poster={src
				.replace(".webm", ".webp")
				.replace("videos-webm", "images-webp")}
			bind:this={el}
			use:inView
			{onenter}
			{onexit}
		>
			<source {src} type="video/mp4" />
		</video>
	{:else}
		<img {src} {alt} loading="lazy" width={w} height={h} />
	{/if}
	{#if !illo}
		<img
			class="frame"
			src="assets/illos/frame-{frame}.png"
			alt=""
			aria-hidden="true"
		/>
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

	figure:not(.illo) {
		min-height: 200px;
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

	@media screen and (min-width: 1020px) {
		figure {
			margin: 0 auto;
		}

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
