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
</style>
