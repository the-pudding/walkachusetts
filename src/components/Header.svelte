<script>
	// import wordmark from "$svg/wordmark-bubble.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			><img src="assets/illos/wordmark.png" alt="the pudding" /></a
		>
	</div>
</header>

<style>
	header {
		max-width: 320px;
		margin: 0 auto;
	}

	.wordmark {
		max-width: 256px;
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

	@media only screen and (min-width: 1020px) {
		header {
			/* margin: 0; */
		}

		.wordmark {
			/* padding: 16px; */
		}
	}
</style>
