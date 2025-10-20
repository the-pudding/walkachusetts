<script>
	import inView from "$actions/inView.js";
	import Play from "@lucide/svelte/icons/play";
	import Pause from "@lucide/svelte/icons/pause";
	const { songs } = $props();

	let audioEls = [];

	let current = $state(null);

	let visible = $state(false);

	function onToggle(i) {
		// if current is playing, pause it
		if (!audioEls[i]) return;
		const playing = !audioEls[i].paused;

		audioEls.forEach((el) => {
			el.pause();
		});

		if (!playing) {
			audioEls[i].play();
			current = i;
		} else {
			current = null;
		}
	}
</script>

<ul use:inView onenter={() => (visible = true)}>
	{#each songs as { title, artist, file, link }, i}
		{@const src = `assets/audio/${file}.mp3`}
		<li>
			<span class="w">
				<button onclick={() => onToggle(i)}>
					<span class="icon"
						>{#if current === i}<Pause></Pause>{:else}<Play></Play>{/if}</span
					>
					<span class="title">{title}</span>
				</button>
				<span class="artist">
					<a href={link} target="_blank" rel="noreferrer">{artist}</a>
				</span>
			</span>
			{#if visible}
				<audio bind:this={audioEls[i]} {src}></audio>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
	}

	li {
		list-style-type: none;
		margin-bottom: 12px;
	}

	button {
		display: flex;
		align-items: center;
		font-size: 13px;
		font-weight: bold;
	}

	.title {
		margin-left: 8px;
	}

	.artist {
		font-family: var(--sans);
		font-size: 13px;
		margin-top: 4px;
	}
</style>
