<script>
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Figure from "$components/Figure.svelte";
	import Abridged from "$components/Abridged.svelte";
	import Tldr from "$components/Tldr.svelte";
	import Sticky from "$components/Sticky.svelte";
	import Jukebox from "$components/Jukebox.svelte";
	import Bit from "$components/Bit.svelte";
	import Image from "@lucide/svelte/icons/image";
	import ScrollText from "@lucide/svelte/icons/scroll-text";
	import lookupFigure from "$utils/lookupFigure.js";
	import cleanBody from "$utils/cleanBody.js";
	import cleanFigures from "$utils/cleanFigures.js";

	const copy = getContext("copy");
	const data = getContext("data");

	const components = {
		Figure,
		Abridged,
		Jukebox,
		Bit
	};

	const body = cleanBody(copy, data);

	const figures = cleanFigures(copy, data);

	let tldr = $state(false);
	let container = $state(null);
	let decided = $state(false);

	let stepCounter = 0;
	const sectionsConfig = body
		.map(({ steps }) => {
			if (steps && isNaN(+steps) === false) {
				const end = stepCounter + +steps;
				const o = { start: stepCounter, end };
				stepCounter = end;
				return o;
			}
			return null;
		})
		.filter((d) => d);

	let scrollY = $state(0);
	let sectionMetrics = $state([]);
	let textEl = $state(null);

	function onToggle(v) {
		if (v !== undefined) {
			if (!tldr && !v) {
				setTimeout(() => {
					const target = document.querySelector("#journal");
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
					const target = document.querySelector("#journal");
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

	$effect(() => {
		const calculateMetrics = () => {
			if (textEl) {
				const sections = [...document.querySelectorAll("#text .stepper")];

				sectionMetrics = sections.map((el) => ({
					top: el.offsetTop,
					height: el.offsetHeight
				}));
			}
		};

		if (decided && !tldr) {
			// Initial calculation when the effect first runs
			calculateMetrics();

			// Listen for window resize as well
			window.addEventListener("resize", calculateMetrics);

			// Cleanup: stop observing and remove listener when component is destroyed
			return () => {
				window.removeEventListener("resize", calculateMetrics);
			};
		}
	});

	$inspect(sectionMetrics);
</script>

<svelte:window bind:scrollY />

<div id="text" class:visible={!tldr} bind:this={textEl}>
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
				<small>Visually-aided journal</small>
			</p>
			<p>
				<button onclick={() => onToggle(true)}
					><span class="icon"><Image></Image></span><span>TLDR</span>
				</button>
				<small>Mostly images</small>
			</p>
		</div>
	</div>

	<div id="journal" class:visible={!tldr && decided}>
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
	<Tldr {figures} {components} />
</div>

<button class="fixed" class:visible={decided} onclick={() => onToggle()}
	><span class="icon"
		>{#if tldr}<ScrollText></ScrollText>{:else}<Image></Image>{/if}</span
	>{tldr ? "TEXT" : "TLDR"}</button
>

<Sticky {sectionMetrics} {scrollY} {sectionsConfig}></Sticky>
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
		width: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0;
	}

	#intro {
		max-width: 360px;
		padding: 0 20px;
	}

	#journal {
		display: none;
		max-width: 360px;
		padding: 0 20px;
	}

	#journal.visible {
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
