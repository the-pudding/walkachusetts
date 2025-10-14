import lookupFigure from "$utils/lookupFigure.js";

export default function (copy, data) {
	return copy.body.map((d) => ({
		...d,
		content: d.content.map((d) => ({
			...d,
			type:
				d.type === "figure"
					? "Figure"
					: d.type === "abridged"
						? "Abridged"
						: d.type,
			value:
				d.type === "figure"
					? lookupFigure(d.value, data.media, data.dimensions)
					: d.type === "abridged"
						? { text: d.value }
						: d.value
		}))
	}));
}
