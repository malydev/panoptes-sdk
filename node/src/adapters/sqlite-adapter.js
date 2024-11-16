/**
 * SQLite database adapter for Panoptes.
 * Adaptador de base de datos SQLite para Panoptes.
 *
 * @module adapters/sqlite-adapter
 */

import { BaseAdapter } from "./base-adapter.js";

/**
 * SQLite adapter implementation.
 * Implementación del adaptador SQLite.
 *
 * @extends BaseAdapter
 */
export class SQLiteAdapter extends BaseAdapter {
	/**
	 * @param {import("./base-adapter.js").AdapterConfig} config - Adapter configuration / Configuración del adaptador
	 */
	constructor(config = {}) {
		super("sqlite", config);
	}

	/**
	 * Validates SQLite client.
	 * Valida el cliente de SQLite.
	 *
	 * @param {any} client - better-sqlite3 Database instance / Instancia de better-sqlite3 Database
	 * @throws {Error} If client is invalid / Si el cliente es inválido
	 */
	validateClient(client) {
		// SQLite clients can have different methods depending on the library
		// better-sqlite3: prepare(), exec()
		// sqlite3: run(), get(), all()
		if (
			!client ||
			(typeof client.prepare !== "function" && typeof client.run !== "function")
		) {
			throw new Error(
				"[Panoptes][sqlite] Invalid client object. Expected a better-sqlite3 Database or sqlite3 Database instance.",
			);
		}
	}

	/**
	 * Extracts SQL and parameters from SQLite query arguments.
	 * Extrae SQL y parámetros de los argumentos de consulta de SQLite.
	 *
	 * @param {any[]} args - Query arguments / Argumentos de consulta
	 * @returns {{ sql: string, params: any[] }} SQL and parameters / SQL y parámetros
	 */
	extractQueryInfo(args) {
		// better-sqlite3: prepare(sql).run(...params) or exec(sql)
		// sqlite3: run(sql, params, callback) or get(sql, params, callback)
		let sql = "";
		let params = [];

		if (typeof args[0] === "string") {
			sql = args[0];

			// Check if second argument is an array (params) or function (callback)
			// Verificar si el segundo argumento es un array (params) o función (callback)
			if (Array.isArray(args[1])) {
				params = args[1];
			} else if (typeof args[1] === "object" && args[1] !== null) {
				// Named parameters / Parámetros nombrados
				params = [args[1]];
			}
		}

		return { sql, params };
	}

	/**
	 * Extracts row count from SQLite result.
	 * Extrae el conteo de filas del resultado de SQLite.
	 *
	 * @param {any} result - Query result / Resultado de consulta
	 * @returns {number | null} Row count / Conteo de filas
	 */
	extractRowCount(result) {
		// better-sqlite3 returns { changes: number } for write operations
		// better-sqlite3 retorna { changes: number } para operaciones de escritura
		if (result && typeof result.changes === "number") {
			return result.changes;
		}

		// sqlite3 callback-based, we get this from the 'this' context
		// sqlite3 basado en callbacks, lo obtenemos del contexto 'this'
		if (result && typeof result.lastID !== "undefined") {
			return result.changes || 1;
		}

		// For SELECT queries, count the rows in the array
		// Para consultas SELECT, contar las filas en el array
		if (Array.isArray(result)) {
			return result.length;
		}

		return null;
	}

	/**
	 * Gets database info for audit event.
	 * Obtiene información de base de datos para evento de auditoría.
	 *
	 * @returns {import("../core/audit-engine.js").DbInfo} Database info / Información de base de datos
	 */
	getDbInfo() {
		return {
			dbEngine: this.engineName,
			dbHost: "local",
			dbName: this.config.database || this.config.filename || "sqlite",
			dbUser: "local",
			dbSchema: "main",
		};
	}
}
