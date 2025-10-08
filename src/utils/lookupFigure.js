export default function lookupFigure(src, media) {
	const isObj = typeof src === "object";
	const s = isObj ? src.value : src;
	// find match to get alt
	const match = media.find((m) => m.src === s.replace("mobile", "illos"));
	return {
		src: `assets/${s}`,
		alt: match?.alt,
		tldr_order: match?.tldr_order,
		sidebar_order: match?.sidebar_order,
		side: s.includes("illos") ? "left" : "right",
		day: match?.day,
		top: match?.top,
		bottom: match?.bottom,
		align: match?.align,
		cl: isObj ? src.cl : ""
	};
}
