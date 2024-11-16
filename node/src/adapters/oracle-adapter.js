/**
 * Oracle database adapter for Panoptes.
 * Adaptador de base de datos Oracle para Panoptes.
 *
 * @module adapters/oracle-adapter
 */

import { BaseAdapter } from "./base-adapter.js";

/**
 * Oracle adapter implementation.
 * Implementación del adaptador Oracle.
 *
 * @extends BaseAdapter
 */
export class OracleAdapter extends BaseAdapter {
	/**
	 * @param {import("./base-adapter.js").AdapterConfig} config - Adapter configuration / Configuración del adaptador
	 */
	constructor(config = {}) {
		super("oracle", config);
	}

	/**
	 * Validates Oracle client.
	 * Valida el cliente de Oracle.
	 *
	 * @param {any} client - oracledb Connection instance / Instancia de oracledb Connection
	 * @throws {Error} If client is invalid / Si el cliente es inválido
	 */
	validateClient(client) {
		if (!client || typeof client.execute !== "function") {
			throw new Error(
				"[Panoptes][oracle] Invalid client object. Expected an oracledb Connection instance.",
			);
		}
	}

	/**
	 * Extracts SQL and parameters from Oracle query arguments.
	 * Extrae SQL y parámetros de los argumentos de consulta de Oracle.
	 *
	 * @param {any[]} args - Query arguments / Argumentos de consulta
	 * @returns {{ sql: string, params: any[] }} SQL and parameters / SQL y parámetros
	 */
	extractQueryInfo(args) {
		// oracledb supports: execute(sql, binds, options)
		// oracledb soporta: execute(sql, binds, options)
		let sql = "";
		let params = [];

		if (typeof args[0] === "string") {
			sql = args[0];

			// Second argument can be bind parameters (array or object)
			// El segundo argumento pueden ser parámetros de bind (array u objeto)
			if (args[1]) {
				if (Array.isArray(args[1])) {
					params = args[1];
				} else if (typeof args[1] === "object") {
					// Named bind parameters / Parámetros de bind nombrados
					params = [args[1]];
				}
			}
		}

		return { sql, params };
	}

	/**
	 * Extracts row count from Oracle result.
	 * Extrae el conteo de filas del resultado de Oracle.
	 *
	 * @param {any} result - Query result / Resultado de consulta
	 * @returns {number | null} Row count / Conteo de filas
	 */
	extractRowCount(result) {
		// oracledb returns { rowsAffected: number } for DML operations
		// oracledb retorna { rowsAffected: number } para operaciones DML
		if (result && typeof result.rowsAffected === "number") {
			return result.rowsAffected;
		}

		// For SELECT queries, check rows array length
		// Para consultas SELECT, verificar longitud del array de filas
		if (result && Array.isArray(result.rows)) {
			return result.rows.length;
		}

		return null;
	}
}
