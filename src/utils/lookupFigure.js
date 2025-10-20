function swap(s) {
	if (s.includes("video")) return s;
	return s.replace("jpg", "webp").replace("png", "webp").replace("/", `-webp/`);
}

export default function lookupFigure(src, media, dimensions) {
	const isObj = typeof src === "object";
	const s = isObj ? src.value : src;
	// find match to get alt
	const swapped = swap(s);
	const m1 = media.find((m) => m.src === s.replace("mobile", "illos"));
	const m2 = dimensions.find((m) => m.src === swapped);

	return {
		src: `assets/${swapped}`,
		alt: m1?.alt,
		tldr_order: m1?.tldr_order,
		sidebar_order: m1?.sidebar_order,
		side: s.includes("illos") ? "left" : "right",
		day: m1?.day,
		top: m1?.top,
		bottom: m1?.bottom,
		align: m1?.align,
		w: m2?.w,
		h: m2?.h,
		cl: isObj ? src.cl : ""
	};
}
