<script>
	import Play from "@lucide/svelte/icons/play";
	import Pause from "@lucide/svelte/icons/pause";
	const { songs } = $props();

	let audioEls = [];

	let current = $state(null);

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

<ul>
	{#each songs as { title, artist, file }, i}
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
					{artist}
				</span>
			</span>
			<audio bind:this={audioEls[i]} {src}></audio>
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

	.w {
		/* display: flex;
		flex-wrap: wrap;
		align-items: center; */
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
		font-size: 13px;
	}
</style>
