/**
 * Generic database interceptor for Panoptes using adapter pattern.
 * Interceptor genérico de base de datos para Panoptes usando patrón adaptador.
 *
 * @module interceptors/generic-interceptor
 */

import { auditQuery } from "../core/audit-engine.js";

/**
 * Attaches audit interceptor to a database client using an adapter.
 * Adjunta un interceptor de auditoría a un cliente de base de datos usando un adaptador.
 *
 * @param {any} client - Database client instance / Instancia del cliente de base de datos
 * @param {import("../adapters/base-adapter.js").BaseAdapter} adapter - Database adapter / Adaptador de base de datos
 * @returns {any} Intercepted client / Cliente interceptado
 */
export function attachGenericInterceptor(client, adapter) {
	adapter.validateClient(client);

	const originalQuery = client.query.bind(client);

	client.query = async (...args) => {
		const start = performance.now();

		let result;
		let success = true;
		let error;

		try {
			result = await originalQuery(...args);
		} catch (err) {
			success = false;
			error = err;
		}

		const end = performance.now();
		const durationMs = end - start;

		const { sql, params } = adapter.extractQueryInfo(args);
		const rowCount = success ? adapter.extractRowCount(result) : null;
		const dbInfo = adapter.getDbInfo();

		await auditQuery({
			db: dbInfo,
			sql,
			params,
			durationMs,
			rowCount,
			success,
			error,
		});

		if (!success) {
			throw error;
		}

		return result;
	};

	return client;
}
