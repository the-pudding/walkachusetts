<script>
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Figure from "$components/Figure.svelte";
	import Sidebar from "$components/Sidebar.svelte";

	const copy = getContext("copy");
	const { body } = copy;

	const components = {
		Figure
	};

	const figures = body[0].content.filter(
		(d) => d.type === "Figure" && !d.value.src.endsWith(".png")
	);
</script>

<div class="c">
	<div class="linear">
		<div class="hero">
			<h1>{copy.meta.title}</h1>
			<p>{copy.meta.description}</p>
		</div>
		<CMS {body} {components} />
	</div>
	<div class="sidebar"><Sidebar {figures} {components} /></div>
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
</style>
