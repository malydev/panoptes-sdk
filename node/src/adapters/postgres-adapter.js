/**
 * PostgreSQL database adapter for Panoptes.
 * Adaptador de base de datos PostgreSQL para Panoptes.
 *
 * @module adapters/postgres-adapter
 */

import { BaseAdapter } from "./base-adapter.js";

/**
 * PostgreSQL adapter implementation.
 * Implementación del adaptador PostgreSQL.
 *
 * @extends BaseAdapter
 */
export class PostgresAdapter extends BaseAdapter {
	/**
	 * @param {import("./base-adapter.js").AdapterConfig} config - Adapter configuration / Configuración del adaptador
	 */
	constructor(config = {}) {
		super("postgres", config);
	}

	/**
	 * Validates PostgreSQL client.
	 * Valida el cliente de PostgreSQL.
	 *
	 * @param {any} client - pg Client instance / Instancia de pg Client
	 * @throws {Error} If client is invalid / Si el cliente es inválido
	 */
	validateClient(client) {
		if (!client || typeof client.query !== "function") {
			throw new Error(
				"[Panoptes][postgres] Invalid client object. Expected a pg Client instance.",
			);
		}
	}

	/**
	 * Extracts SQL and parameters from pg query arguments.
	 * Extrae SQL y parámetros de los argumentos de consulta de pg.
	 *
	 * @param {any[]} args - Query arguments / Argumentos de consulta
	 * @returns {{ sql: string, params: any[] }} SQL and parameters / SQL y parámetros
	 */
	extractQueryInfo(args) {
		// pg supports: query(text, values) or query({ text, values })
		// pg soporta: query(text, values) o query({ text, values })
		const sql = typeof args[0] === "string" ? args[0] : args[0]?.text;
		const params = typeof args[0] === "string" ? args[1] : args[0]?.values;

		return {
			sql: sql || "",
			params: params || [],
		};
	}

	/**
	 * Extracts row count from pg result.
	 * Extrae el conteo de filas del resultado de pg.
	 *
	 * @param {any} result - Query result / Resultado de consulta
	 * @returns {number | null} Row count / Conteo de filas
	 */
	extractRowCount(result) {
		return result?.rowCount != null ? result.rowCount : null;
	}
}
