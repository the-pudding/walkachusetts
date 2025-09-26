<script>
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Figure from "$components/Figure.svelte";

	const copy = getContext("copy");
	const { body } = copy;

	const components = {
		Figure
	};
</script>

<div class="c">
	<CMS {body} {components} />
</div>

<svelte:boundary onerror={(e) => console.error(e)}>
	<!-- <Footer recirc={true} /> -->
</svelte:boundary>

<style>
	.c {
		max-width: var(--col-width);
		margin: 0 auto;
		padding: 0 1rem;
	}
</style>
