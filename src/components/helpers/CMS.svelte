<script>
	import { getContext } from "svelte";
	const data = getContext("data");
	// components: an object of components that map to section names (e.g., { "Hero": Hero }) where Hero is a Svelte component
	// body: an array of objects that contain a {section, content} obj
	let { components = {}, body = [] } = $props();

	const Figure = components.Figure;

	function lookupFigure(src) {
		// find match to get alt
		const match = data.media.find((m) => m.src === src);
		return {
			src: `assets/${src}`,
			alt: match?.alt,
			tldr_order: match?.tldr_order,
			side: src.includes("illos") ? "left" : "right",
			day: match?.day,
			top: match?.top,
			bottom: match?.bottom,
			align: match?.align
		};
	}

	function custom(str) {
		const chunks = str.split("~").map((d) => {
			if (d.includes(".jpg") || d.includes(".png") || d.includes(".mp4")) {
				return lookupFigure(d.trim());
			} else {
				return `<span class="text">${d.trim()}</span>`;
			}
		});

		return chunks;
	}
</script>

{#each body as { section, content }}
	<!-- replace all non alpha numeric characters with "" -->
	{@const id = section.toLowerCase().replace(/[^a-z0-9]/g, "")}
	{@const C = components[section]}
	<section {id}>
		{#if C}
			<C {...content} />
		{:else}
			{#each content as { type, value }}
				{@const C = components[type]}
				{@const isString = typeof value === "string"}
				{@const chunks = type === "text" ? custom(value) : [value]}
				{#if C}
					<C {...value} />
				{:else if type === "text"}
					<p>
						{#each chunks as chunk}
							{#if typeof chunk === "string"}
								<span class="text">
									{@html chunk.replace("\\", "")}
								</span>
							{:else}
								<Figure {...chunk} />
							{/if}
						{/each}
					</p>
				{:else if isString}
					<svelte:element this={type}>
						{@html value}
					</svelte:element>
				{:else}
					<svelte:element this={type} {...value}></svelte:element>
				{/if}
			{/each}
		{/if}
	</section>
{/each}

<style>
</style>
