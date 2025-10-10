<script>
	import wordmark from "$svg/wordmark-bubble.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			><span>{@html wordmark}</span></a
		>
	</div>
</header>

<style>
	header {
		max-width: 14em;
		margin: 0.5rem auto;
		text-align: center;
	}

	.wordmark {
		padding: 16px 0;
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.wordmark a:hover {
		background-color: transparent;
	}
</style>
