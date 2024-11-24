import { sendToConsole } from "./console-transport.js";
import { sendToDatabase } from "./database-transport.js";
import { sendToFile } from "./file-transport.js";
import { sendToHttp } from "./http-transport.js";

/**
 * @typedef {import("../core/config-manager.js").PanoptesConfig} PanoptesConfig
 */

/**
 * Dispatches audit event to all enabled transports.
 * Envía un evento de auditoría a todos los transports habilitados.
 *
 * @param {any} event - Audit event / Evento de auditoría
 * @param {PanoptesConfig} config - Panoptes configuration / Configuración de Panoptes
 */
export async function dispatchAuditEvent(event, config) {
	const enabled = config.transports.enabled || [];

	const promises = enabled.map((t) => {
		if (t === "console") {
			return sendToConsole(event);
		}
		if (t === "file") {
			return sendToFile(event, config.transports.file || {});
		}
		if (t === "http") {
			return sendToHttp(event, config.transports.http || {});
		}
		if (t === "database") {
			return sendToDatabase(event, config.transports);
		}
		return Promise.resolve();
	});

	// We don't want a failure in one transport to break the others.
	// No queremos que un fallo en un transport rompa al resto.
	try {
		await Promise.all(promises);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(
			"[Panoptes][transport-dispatcher] Error dispatching event:",
			err,
		);
	}
}
