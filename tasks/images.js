import fs from "fs/promises";
import sharp from "sharp";
import path from "path";
import { csvFormat } from "d3"; // Correct import for server-side D3

// --- Configuration ---
// Define all your processing jobs here.
const JOBS = [
	{
		inputDir: "static/assets/features",
		outputDir: "static/assets/features-webp/",
		webpQuality: 75
	},
	{
		inputDir: "static/assets/illos",
		outputDir: "static/assets/illos-webp/",
		resizeWidth: 640,
		webpQuality: 75
	},
	{
		inputDir: "static/assets/mobile",
		outputDir: "static/assets/mobile-webp/",
		resizeWidth: 640,
		webpQuality: 75
	},
	{
		inputDir: "static/assets/images",
		outputDir: "static/assets/images-webp/",
		resizeWidth: 640,
		webpQuality: 80
	}
];

// A single CSV file for the combined data.
const OUTPUT_CSV = "src/data/dimensions.csv";
// ---------------------

/**
 * Processes a single folder based on a job configuration.
 * @param {object} job - The configuration for a single folder.
 * @returns {Promise<Array>} A promise resolving to an array of processed image data.
 */
async function processFolder(job) {
	console.log(`\n🚀 Processing job for: '${job.inputDir}'`);
	await fs.mkdir(job.outputDir, { recursive: true });

	const allFiles = await fs.readdir(job.inputDir);
	const imageFiles = allFiles.filter(
		(f) => f.toLowerCase().endsWith(".png") || f.toLowerCase().endsWith(".jpg")
	);

	const imageData = [];

	for (const file of imageFiles) {
		const inputPath = path.join(job.inputDir, file);
		const baseName = path.parse(file).name;
		const outputPath = path.join(job.outputDir, `${baseName}.webp`);
		const fileExtension = path.extname(file).toLowerCase();

		try {
			let sharpInstance = job.resizeWidth
				? sharp(inputPath).resize({ width: job.resizeWidth })
				: sharp(inputPath);
			let outputInfo;

			if (fileExtension === ".png") {
				outputInfo = await sharpInstance
					.webp({ lossless: true })
					.toFile(outputPath);
			} else {
				// Handles .jpg and .jpeg
				outputInfo = await sharpInstance
					.webp({ quality: job.webpQuality })
					.toFile(outputPath);
			}

			console.log(`  ✅ Converted: ${file}`);

			// Standardize the data object for all image types
			imageData.push({
				src: outputPath.replace("static/assets/", ""), // Create relative path for CSV
				width: outputInfo.width,
				height: outputInfo.height
			});
		} catch (err) {
			console.error(`  ❌ Error processing ${file}: ${err.message}`);
		}
	}
	return imageData;
}

/**
 * Main function to run all jobs and write the final CSV.
 */
async function runAllJobs() {
	let allImageData = [];

	for (const job of JOBS) {
		const folderData = await processFolder(job);
		allImageData.push(...folderData);
	}

	if (allImageData.length === 0) {
		console.log("\nNo images were processed. CSV not created.");
		return;
	}

	// Map the combined data to the desired CSV format: src, w, h
	const dataForCsv = allImageData.map((d) => ({
		src: d.src,
		w: d.width,
		h: d.height
	}));

	const csvContent = csvFormat(dataForCsv);
	const csvDir = path.dirname(OUTPUT_CSV);
	await fs.mkdir(csvDir, { recursive: true });
	await fs.writeFile(OUTPUT_CSV, csvContent);

	console.log(
		`\n🎉 Success! All jobs complete. Data for ${allImageData.length} images saved to '${OUTPUT_CSV}'.`
	);
}

// Run the script
runAllJobs().catch((err) => console.error(err));
