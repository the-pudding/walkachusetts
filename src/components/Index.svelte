<script>
	import { ascending } from "d3";
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import UI from "$components/UI.svelte";
	import Figure from "$components/Figure.svelte";
	import Abridged from "$components/Abridged.svelte";
	import Tldr from "$components/Tldr.svelte";
	import Jukebox from "$components/Jukebox.svelte";
	import Bit from "$components/Bit.svelte";
	import lookupFigure from "$utils/lookupFigure.js";

	const copy = getContext("copy");
	const data = getContext("data");

	const components = {
		Figure,
		Abridged,
		Jukebox,
		Bit
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
						? lookupFigure(d.value, data.media)
						: d.type === "abridged"
							? { text: d.value }
							: d.value
			}))
		}
	];

	const tldrFigures = data.media
		.map((d) => ({
			type: "Figure",
			value: lookupFigure(d.src, data.media)
		}))
		.filter((d) => +d.value.tldr_order > 0);

	tldrFigures.sort((a, b) =>
		ascending(+a.value.tldr_order, +b.value.tldr_order)
	);

	const abridgedCopy = copy.body[0].content
		.filter((d) => d.type === "abridged")
		.map((d, i) => ({
			type: "Abridged",
			value: { text: d.value }
		}));

	// insert abridged copy into tldr figures at intervals (find .day that matches of abridgeCopy index, and insert there)
	abridgedCopy.forEach((d, i) => {
		const dayIndex = tldrFigures.findIndex((f) => +f.value.day === i);
		// insert abridged copy before dayIndex
		if (dayIndex !== -1) {
			tldrFigures.splice(dayIndex, 0, d);
		}
	});

	let tldr = $state(false);

	function onToggle() {
		tldr = !tldr;
	}
</script>

<div class="classic" class:visible={!tldr}>
	<div class="linear">
		<UI></UI>
		<div class="hero">
			<h1>{copy.hed}</h1>
			<p>{@html copy.byline}</p>
		</div>
		<CMS {body} {components} />
	</div>
</div>

<div class="tldr" class:visible={tldr}>
	<!-- <Tldr figures={tldrFigures} {components} /> -->
</div>

<svelte:boundary onerror={(e) => console.error(e)}>
	<!-- <Footer recirc={true} /> -->
</svelte:boundary>

<style>
	.classic {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0;
		display: none;
		justify-content: center;
	}

	.classic.visible {
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
	}

	.hero p {
		font-family: var(--sans);
		font-size: 13px;
		margin-top: 0.5rem;
	}

	button {
		position: fixed;
		top: 0;
		left: 0;
		/* display: none; */
	}

	.tldr {
		max-width: none !important;
		display: none;
	}

	.tldr.visible {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	.linear {
		max-width: 360px;
		padding: 0 20px;
	}
</style>
