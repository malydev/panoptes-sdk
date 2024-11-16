/**
 * MySQL database adapter for Panoptes.
 * Adaptador de base de datos MySQL para Panoptes.
 *
 * @module adapters/mysql-adapter
 */

import { BaseAdapter } from "./base-adapter.js";

/**
 * MySQL adapter implementation.
 * Implementación del adaptador MySQL.
 *
 * @extends BaseAdapter
 */
export class MySQLAdapter extends BaseAdapter {
	/**
	 * @param {import("./base-adapter.js").AdapterConfig} config - Adapter configuration / Configuración del adaptador
	 */
	constructor(config = {}) {
		super("mysql", config);
	}

	/**
	 * Validates MySQL client.
	 * Valida el cliente de MySQL.
	 *
	 * @param {any} client - mysql2 Connection instance / Instancia de mysql2 Connection
	 * @throws {Error} If client is invalid / Si el cliente es inválido
	 */
	validateClient(client) {
		if (
			!client ||
			(typeof client.query !== "function" &&
				typeof client.execute !== "function")
		) {
			throw new Error(
				"[Panoptes][mysql] Invalid client object. Expected a mysql2 Connection/Pool instance.",
			);
		}
	}

	/**
	 * Extracts SQL and parameters from mysql2 query arguments.
	 * Extrae SQL y parámetros de los argumentos de consulta de mysql2.
	 *
	 * @param {any[]} args - Query arguments / Argumentos de consulta
	 * @returns {{ sql: string, params: any[] }} SQL and parameters / SQL y parámetros
	 */
	extractQueryInfo(args) {
		// mysql2 supports: query(sql, values, callback) or query(sql, callback) or query({ sql, values })
		// mysql2 soporta: query(sql, values, callback) o query(sql, callback) o query({ sql, values })
		let sql = "";
		let params = [];

		if (typeof args[0] === "string") {
			sql = args[0];
			if (Array.isArray(args[1])) {
				params = args[1];
			}
		} else if (typeof args[0] === "object") {
			sql = args[0].sql || "";
			params = args[0].values || [];
		}

		return { sql, params };
	}

	/**
	 * Extracts row count from mysql2 result.
	 * Extrae el conteo de filas del resultado de mysql2.
	 *
	 * @param {any} result - Query result / Resultado de consulta
	 * @returns {number | null} Row count / Conteo de filas
	 */
	extractRowCount(result) {
		// mysql2 returns different result formats depending on query type
		// mysql2 retorna diferentes formatos de resultado dependiendo del tipo de consulta
		if (Array.isArray(result)) {
			// For SELECT queries, first element is rows array
			// Para consultas SELECT, el primer elemento es el array de filas
			return result[0]?.affectedRows ?? result[0]?.length ?? null;
		}
		return result?.affectedRows ?? null;
	}
}
