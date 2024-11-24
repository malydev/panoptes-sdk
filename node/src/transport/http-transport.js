/**
 * @param {any} event
 * @param {{ endpoint: string }} httpConfig
 */
export async function sendToHttp(event, httpConfig) {
	const endpoint = httpConfig?.endpoint;
	if (!endpoint) return;

	try {
		await fetch(endpoint, {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(event),
		});
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error("[Panoptes][http-transport] Error sending event:", err);
	}
}
