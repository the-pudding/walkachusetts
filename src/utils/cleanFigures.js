import lookupFigure from "$utils/lookupFigure.js";
import { ascending } from "d3";

export default function cleanFigures(copy, data) {
	const tldrFigures = data.media
		.map((d) => ({
			type: "Figure",
			value: lookupFigure(d.src, data.media, data.dimensions)
		}))
		.filter((d) => +d.value.tldr_order > 0);

	tldrFigures.sort((a, b) =>
		ascending(+a.value.tldr_order, +b.value.tldr_order)
	);

	const abridgedCopy = [
		...copy.body.map((d) =>
			d.content
				.filter((d) => d.type === "abridged")
				.map((d, i) => ({
					type: "Abridged",
					value: { text: d.value }
				}))
		)
	].flat();

	abridgedCopy.forEach((d, i) => {
		const dayIndex = tldrFigures.findIndex((f) => +f.value.day === i);
		// insert abridged copy before dayIndex
		if (dayIndex !== -1) {
			tldrFigures.splice(dayIndex, 0, d);
		} else {
			// if no matching day, push to end
			tldrFigures.push(d);
		}
	});

	return tldrFigures;
}
