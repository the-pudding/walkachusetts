<script>
	import { ascending } from "d3";
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Figure from "$components/Figure.svelte";
	import Abridged from "$components/Abridged.svelte";
	import Tldr from "$components/Tldr.svelte";
	import Jukebox from "$components/Jukebox.svelte";
	import Bit from "$components/Bit.svelte";
	import lookupFigure from "$utils/lookupFigure.js";
	import Image from "@lucide/svelte/icons/image";
	import ScrollText from "@lucide/svelte/icons/scroll-text";

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
		} else {
			// if no matching day, push to end
			tldrFigures.push(d);
		}
	});

	let tldr = $state(false);
	let container = $state(null);

	function onToggle() {
		// move scroll to top
		window.scrollTo({ top: 0 });
		tldr = !tldr;
	}

	$effect(() => {
		const els = document.querySelectorAll(".tldr a");
		if (container && els.length) {
			[...els].forEach((el) => {
				el.addEventListener("click", (e) => {
					e.stopPropagation();
					e.preventDefault();
					onToggle();
					const href = e.currentTarget.getAttribute("href");
					setTimeout(() => {
						const target = document.querySelector(href);
						if (target) target.scrollIntoView({ block: "start" });
					}, 300);
				});
			});
		}
	});
</script>

<div class="classic" class:visible={!tldr}>
	<div class="linear">
		<div class="hero" id="hero">
			<h1>{copy.hed}</h1>
			<p>{@html copy.byline}</p>
		</div>
		<CMS {body} {components} />
	</div>
</div>

<div class="tldr" class:visible={tldr} bind:this={container}>
	<Tldr figures={tldrFigures} {components} />
</div>

<button onclick={onToggle}
	><span class="icon"
		>{#if tldr}<ScrollText></ScrollText>{:else}<Image></Image>{/if}</span
	>{tldr ? "TEXT" : "TLDR"}</button
>
<svelte:boundary onerror={(e) => console.error(e)}>
	<Footer recirc={true} />
</svelte:boundary>

<style>
	.classic {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0;
		display: none;
		justify-content: center;
		min-height: 150vh;
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
		bottom: 16px;
		right: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: bold;
		width: 7em;
		z-index: var(--z-overlay);
	}

	button .icon {
		margin-right: 8px;
	}

	.tldr {
		display: none;
	}

	.tldr.visible {
		display: grid;
	}

	.linear {
		max-width: 360px;
		padding: 0 20px;
	}

	@media only screen and (min-width: 1020px) {
		button {
			top: 16px;
			left: 16px;
			right: auto;
			bottom: auto;
		}
	}
</style>
