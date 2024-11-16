/**
 * Microsoft SQL Server database adapter for Panoptes.
 * Adaptador de base de datos Microsoft SQL Server para Panoptes.
 *
 * @module adapters/mssql-adapter
 */

import { BaseAdapter } from "./base-adapter.js";

/**
 * MSSQL adapter implementation.
 * Implementación del adaptador MSSQL.
 *
 * @extends BaseAdapter
 */
export class MSSQLAdapter extends BaseAdapter {
	/**
	 * @param {import("./base-adapter.js").AdapterConfig} config - Adapter configuration / Configuración del adaptador
	 */
	constructor(config = {}) {
		super("mssql", config);
	}

	/**
	 * Validates MSSQL client.
	 * Valida el cliente de MSSQL.
	 *
	 * @param {any} client - mssql ConnectionPool or Request instance / Instancia de mssql ConnectionPool o Request
	 * @throws {Error} If client is invalid / Si el cliente es inválido
	 */
	validateClient(client) {
		if (
			!client ||
			(typeof client.query !== "function" &&
				typeof client.request !== "function")
		) {
			throw new Error(
				"[Panoptes][mssql] Invalid client object. Expected an mssql ConnectionPool or Request instance.",
			);
		}
	}

	/**
	 * Extracts SQL and parameters from mssql query arguments.
	 * Extrae SQL y parámetros de los argumentos de consulta de mssql.
	 *
	 * @param {any[]} args - Query arguments / Argumentos de consulta
	 * @returns {{ sql: string, params: any[] }} SQL and parameters / SQL y parámetros
	 */
	extractQueryInfo(args) {
		// mssql supports: query(sql) - parameters are bound separately with input()
		// mssql soporta: query(sql) - los parámetros se vinculan por separado con input()
		const sql = typeof args[0] === "string" ? args[0] : "";

		// For mssql, parameters are typically bound separately, so we'll extract them from context if available
		// Para mssql, los parámetros típicamente se vinculan por separado, así que los extraeremos del contexto si están disponibles
		const params = [];

		return { sql, params };
	}

	/**
	 * Extracts row count from mssql result.
	 * Extrae el conteo de filas del resultado de mssql.
	 *
	 * @param {any} result - Query result / Resultado de consulta
	 * @returns {number | null} Row count / Conteo de filas
	 */
	extractRowCount(result) {
		// mssql returns result with recordset and rowsAffected
		// mssql retorna resultado con recordset y rowsAffected
		if (result?.rowsAffected && Array.isArray(result.rowsAffected)) {
			return result.rowsAffected.reduce((sum, count) => sum + count, 0);
		}
		return result?.recordset?.length ?? null;
	}
}
