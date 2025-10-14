<script>
	import { format } from "d3";
	let { scrollY, sectionMetrics, sectionsConfig } = $props();

	const tickerValue = $derived.by(() => {
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
</script>

<div id="sticky">
	<p>{format(",.0f")(tickerValue)}</p>
</div>

<style>
	#sticky {
		position: fixed;
		top: 0;
		right: 0;
		z-index: var(--z-overlay);
	}
</style>
