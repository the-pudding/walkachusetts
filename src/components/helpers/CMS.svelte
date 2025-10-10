<script>
	import { getContext } from "svelte";
	import lookupFigure from "$utils/lookupFigure.js";
	const data = getContext("data");
	// components: an object of components that map to section names (e.g., { "Hero": Hero }) where Hero is a Svelte component
	// body: an array of objects that contain a {section, content} obj
	let { components = {}, body = [] } = $props();

	const Figure = components.Figure;

	function custom(str) {
		const chunks = str.split("~").map((d) => {
			if (d.includes(".jpg") || d.includes(".png") || d.includes(".mp4")) {
				return lookupFigure(d.trim(), data.media, data.dimensions);
			} else {
				return `${d.trim()}`;
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
					<div class="chunk">
						{#each chunks as chunk}
							{#if typeof chunk === "string"}
								<p>{@html chunk.replace("\\", "")}</p>
							{:else}
								<Figure {...chunk} />
							{/if}
						{/each}
					</div>
				{:else if type === "h2"}
					<h2 id={value.toLowerCase().replace(/[^a-z]/g, "")}>{@html value}</h2>
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
