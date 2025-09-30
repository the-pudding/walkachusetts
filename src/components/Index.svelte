<script>
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Figure from "$components/Figure.svelte";
	import Abridged from "$components/Abridged.svelte";
	import Sidebar from "$components/Sidebar.svelte";

	const copy = getContext("copy");
	const data = getContext("data");

	const components = {
		Figure,
		Abridged
	};

	const body = [
		{
			...copy.body[0],
			content: copy.body[0].content.map((d) => ({
				...d,
				type:
					d.type === "figure"
						? "Figure"
						: d.type === "abridged"
							? "Abridged"
							: d.type,
				value:
					d.type === "figure"
						? lookupFigure(d.value)
						: d.type === "abridged"
							? { text: d.value }
							: d.value
			}))
		}
	];

	const figures = data.media
		.filter((d) => d.sidebar)
		.map((d) => ({
			type: "Figure",
			value: lookupFigure(d.src, true)
		}));

	let tldr = $state(false);

	function lookupFigure(src, margin) {
		// find match to get alt
		const match = data.media.find((m) => m.src === src);
		return {
			src: `assets/${src}`,
			alt: match ? match.alt : "",
			top: margin && match ? match.top : ""
		};
	}

	function onToggle() {
		tldr = !tldr;
	}
</script>

<div class="c" class:tldr>
	<div class="linear">
		<div class="hero">
			<h1>{copy.meta.title}</h1>
			<p>{copy.meta.description}</p>
		</div>
		<CMS {body} {components} />
	</div>
	<div class="sidebar"><Sidebar {figures} {components} /></div>
	<button onclick={onToggle}>TLDR</button>
</div>

<svelte:boundary onerror={(e) => console.error(e)}>
	<!-- <Footer recirc={true} /> -->
</svelte:boundary>

<style>
	.c {
		max-width: var(--col-width);
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
	}

	h1 {
		display: inline-flex;
		line-height: 1;
		font-size: var(--18px);
		background: var(--color-fg);
		color: var(--color-bg);
		padding: 0.5em;
		text-transform: uppercase;
		font-family: var(--sans);
		margin: 0;
		margin-top: 4rem;
	}

	.hero p {
		font-family: var(--sans);
		font-weight: bold;
		margin: 0;
		font-size: var(--28px);
	}

	button {
		position: fixed;
		top: 0;
		left: 0;
		display: none;
	}

	.tldr {
		max-width: none !important;
	}

	.tldr .sidebar {
		display: none;
	}

	.tldr .linear {
		width: 100%;
		padding: 0;
	}
</style>
