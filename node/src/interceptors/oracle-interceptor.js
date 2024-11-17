/**
 * Oracle database interceptor for Panoptes.
 * Interceptor de base de datos Oracle para Panoptes.
 *
 * @module interceptors/oracle-interceptor
 */

import { OracleAdapter } from "../adapters/oracle-adapter.js";

/**
 * Creates an audited Oracle client.
 * Crea un cliente Oracle auditado.
 * Wraps an existing oracledb Connection instance to intercept and audit all queries.
 * Envuelve una instancia existente de oracledb Connection para interceptar y auditar todas las consultas.
 *
 * @param {any} connection - oracledb Connection instance / Instancia de oracledb Connection
 * @param {import("../adapters/base-adapter.js").AdapterConfig} dbOptions - Database connection options / Opciones de conexión a la base de datos
 * @returns {any} The same connection, but intercepted / La misma conexión, pero interceptada
 * @throws {Error} If client is invalid / Si el cliente es inválido
 */
export function attachOracleInterceptor(connection, dbOptions = {}) {
	const adapter = new OracleAdapter(dbOptions);

	// Oracle uses execute() instead of query()
	// Oracle usa execute() en lugar de query()
	adapter.validateClient(connection);

	const originalExecute = connection.execute.bind(connection);

	connection.execute = async (...args) => {
		const start = performance.now();

		let result;
		let success = true;
		let error;

		try {
			result = await originalExecute(...args);
		} catch (err) {
			success = false;
			error = err;
		}

		const end = performance.now();
		const durationMs = end - start;

		const { sql, params } = adapter.extractQueryInfo(args);
		const rowCount = success ? adapter.extractRowCount(result) : null;
		const dbInfo = adapter.getDbInfo();

		const { auditQuery } = await import("../core/audit-engine.js");

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

	return connection;
}
