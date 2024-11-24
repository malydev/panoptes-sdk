import { appendFile } from "node:fs/promises";

/**
 * @param {any} event
 * @param {{ path: string }} fileConfig
 */
export async function sendToFile(event, fileConfig) {
	const line = `${JSON.stringify(event)}\n`;
	const path = fileConfig?.path || "panoptes-audit.log";

	try {
		await appendFile(path, line, { encoding: "utf8" });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error("[Panoptes][file-transport] Error writing log:", err);
	}
}
