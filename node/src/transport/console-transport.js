/**
 * @param {any} event
 */
export async function sendToConsole(event) {
	// Simple por ahora. Luego podemos mejorar el formato.
	// No usamos console.log a lo loco; dejamos claro que es Panoptes.
	// eslint-disable-next-line no-console
	console.log("[Panoptes][audit-event]", JSON.stringify(event));
}
