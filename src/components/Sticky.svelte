<script>
	import { format } from "d3";
	import route from "$svg/route.svg";
	let { scrollY, sectionMetrics, sectionsConfig } = $props();

	let routeEl = $state(null);

	let tickerSteps = $derived.by(() => {
		if (!sectionMetrics || sectionMetrics.length === 0) {
			return sectionsConfig[0]?.start ?? 0;
		}
		let currentValue = sectionsConfig[0].start;

		for (const [i, metric] of sectionMetrics.entries()) {
			const sectionStart = metric.top;
			const sectionEnd = sectionStart + metric.height;
			const config = sectionsConfig[i];

			if (scrollY >= sectionStart && scrollY < sectionEnd) {
				const scrollDistance = scrollY - sectionStart;
				const progress = scrollDistance / metric.height;
				const range = config.end - config.start;

				return config.start + progress * range;
			}

			if (scrollY >= sectionEnd) currentValue = config.end;
		}

		return currentValue;
	});

	let tickerMiles = $derived.by(() => tickerSteps / 2300);
	let visible = $derived.by(() => tickerSteps > 0);

	let pathLength = $state(0);

	let pathOffset = $derived.by(() => {
		if (sectionMetrics.length === 0 || pathLength === 0) {
			// Before, this was 0. Now, it starts at max length (invisible).
			return pathLength;
		}

		const animationStart = sectionMetrics[0].top;
		const lastSection = sectionMetrics[sectionMetrics.length - 1];
		const animationEnd = lastSection.top + lastSection.height;
		const animationDistance = animationEnd - animationStart;

		if (animationDistance <= 0) return pathLength;
		if (scrollY < animationStart) return pathLength; // Before start, fully invisible
		if (scrollY > animationEnd) return 0; // After end, fully drawn

		const progress = (scrollY - animationStart) / animationDistance;

		// THIS IS THE KEY CHANGE:
		// Instead of starting at 0 and adding, we start at the max
		// length and subtract.
		return pathLength - progress * pathLength;
	});

	// 3. EFFECT TO MEASURE THE PATH
	// This runs once the SVG is rendered inside the component.
	$effect(() => {
		if (routeEl) {
			const path = routeEl.querySelector("path");
			if (path) pathLength = path.getTotalLength();
		}
	});
</script>

<div id="sticky" class:visible>
	<div
		bind:this={routeEl}
		class="route"
		style="--path-length: {pathLength}; --path-offset: {pathOffset};"
	>
		<span class="bg">{@html route}</span>
		<span class="fg">{@html route}</span>
	</div>
	<p>
		<span>{format(",.0f")(tickerSteps)} steps</span>
		<span>{format(".0f")(tickerMiles)} miles</span>
	</p>
</div>

<style>
	#sticky {
		position: fixed;
		top: 0;
		right: 0;
		z-index: calc(var(--z-overlay) - 1);
		width: 100%;
		background: var(--color-fg);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s ease-in-out;
		padding: 1rem;
	}

	#sticky.visible {
		opacity: 0.95;
	}

	p {
		margin: 0;
		line-height: 1;
		font-family: var(--sans);
		font-variant-numeric: tabular-nums;
		color: var(--color-gray-100);
		position: absolute;
		top: 50%;
		right: 16px;
		transform: translateY(-50%);
	}

	p span {
		display: block;
		text-align: right;
	}

	p span:nth-child(2) {
		margin-top: 4px;
		font-size: 13px;
		color: var(--color-gray-300);
	}

	.route {
		max-width: 320px;
		margin: 0 auto;
		position: relative;
	}

	.route:before,
	.route:after {
		display: block;
		position: absolute;
		color: var(--color-gray-300);
		font-size: var(--12px);
		font-family: var(--sans);
		text-transform: uppercase;
	}

	.route:before {
		content: "Cambridge";
		top: 0;
		right: 0;
		transform: translate(calc(100% + 10px), 0);
	}

	.route:after {
		content: "Great Barrington";
		top: 75%;
		left: 0;
		transform: translate(calc(-100% - 10px), 0);
	}

	.route span {
		display: block;
		width: 100%;
	}

	.route .fg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	:global(#sticky svg) {
		width: 100%;
		display: block;
	}

	:global(#sticky .bg svg path) {
		stroke: var(--color-gray-600);
		stroke-width: 8px;
		fill: none;
	}

	:global(#sticky .fg svg path) {
		stroke: var(--color-gray-100);
		stroke-width: 16px;
		fill: none;
		stroke-dasharray: var(--path-length);
		stroke-dashoffset: var(--path-offset);
	}
</style>
