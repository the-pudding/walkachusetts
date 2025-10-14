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

	const body = copy.body.map((d) => ({
		section: d.section,
		content: d.content.map((d) => ({
			...d,
			type:
				d.type === "figure"
					? "Figure"
					: d.type === "abridged"
						? "Abridged"
						: d.type,
			value:
				d.type === "figure"
					? lookupFigure(d.value, data.media, data.dimensions)
					: d.type === "abridged"
						? { text: d.value }
						: d.value
		}))
	}));

	const tldrFigures = data.media
		.map((d) => ({
			type: "Figure",
			value: lookupFigure(d.src, data.media, data.dimensions)
		}))
		.filter((d) => +d.value.tldr_order > 0);

	tldrFigures.sort((a, b) =>
		ascending(+a.value.tldr_order, +b.value.tldr_order)
	);

	const abridgedCopy = [
		...copy.body.map((d) =>
			d.content
				.filter((d) => d.type === "abridged")
				.map((d, i) => ({
					type: "Abridged",
					value: { text: d.value }
				}))
		)
	].flat();

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
	let decided = $state(false);

	function onToggle(v) {
		if (v !== undefined) {
			if (!tldr && !v) {
				setTimeout(() => {
					const target = document.querySelector("#diary");
					if (target)
						target.scrollIntoView({ block: "start", behavior: "smooth" });
				}, 100);
			} else if (v) window.scrollTo({ top: 0 });

			tldr = v;
			decided = true;
		} else {
			decided = true;
			tldr = !tldr;
			if (tldr) window.scrollTo({ top: 0 });
			else {
				setTimeout(() => {
					const target = document.querySelector("#diary");
					if (target) target.scrollIntoView({ block: "start" });
				}, 100);
			}
		}
	}

	$effect(() => {
		const els = document.querySelectorAll("#tldr a");
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

<div id="text" class:visible={!tldr}>
	<div id="intro">
		<h1 class="sr-only">{copy.hed}</h1>
		<p>{@html copy.intro.a}</p>
		<Figure {...lookupFigure("mobile/cast.png", data.media, data.dimensions)} />
		<p>{@html copy.intro.b}</p>
		<p>{@html copy.intro.c}</p>
		<p>{@html copy.intro.d}</p>
		<div class="decide">
			<p>
				<button onclick={() => onToggle(false)}
					><span class="icon"><ScrollText></ScrollText></span><span>TEXT</span>
				</button>
				<small>Visually-aided diary</small>
			</p>
			<p>
				<button onclick={() => onToggle(true)}
					><span class="icon"><Image></Image></span><span>TLDR</span>
				</button>
				<small>Mostly images</small>
			</p>
		</div>
	</div>

	<div id="diary" class:visible={!tldr && decided}>
		<div class="hero" id="hero">
			<h1 class="sr-only">{copy.hed}</h1>
			<Figure
				{...lookupFigure("features/title.png", data.media, data.dimensions)}
			/>
			<p class="byline">{@html copy.byline}</p>
		</div>
		<CMS {body} {components} />
	</div>
</div>

<div id="tldr" class:visible={tldr} bind:this={container}>
	<Tldr figures={tldrFigures} {components} />
</div>

<button class="fixed" class:visible={decided} onclick={() => onToggle()}
	><span class="icon"
		>{#if tldr}<ScrollText></ScrollText>{:else}<Image></Image>{/if}</span
	>{tldr ? "TEXT" : "TLDR"}</button
>
<svelte:boundary onerror={(e) => console.error(e)}>
	<Footer recirc={true} />
</svelte:boundary>

<style>
	#text {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0;
		display: none;
		justify-content: center;
		min-height: 100vh;
	}

	#text.visible {
		display: block;
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

	button.fixed {
		position: fixed;
		bottom: 16px;
		right: 16px;
		z-index: var(--z-overlay);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s ease-in-out;
	}

	button.fixed.visible {
		opacity: 1;
		pointer-events: auto;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: bold;
		width: 7em;
	}

	button .icon {
		margin-right: 8px;
	}

	#tldr {
		display: none;
	}

	#tldr.visible {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
	}

	.decide {
		display: flex;
		justify-content: center;
	}

	.decide p {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 1rem;
	}

	#intro {
		max-width: 360px;
		padding: 0 20px;
	}

	#diary {
		display: none;
		max-width: 360px;
		padding: 0 20px;
	}

	#diary.visible {
		display: block;
	}

	.byline {
		font-family: var(--sans);
		font-size: 13px;
		margin-top: -4rem;
	}

	@media only screen and (min-width: 1020px) {
		button.fixed {
			top: 16px;
			left: 16px;
			right: auto;
			bottom: auto;
		}
	}
</style>
