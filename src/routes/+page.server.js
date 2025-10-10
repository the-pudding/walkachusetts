import media from "$data/media.csv";
import dimensions from "$data/dimensions.csv";
export async function load() {
	return { media, dimensions };
}
