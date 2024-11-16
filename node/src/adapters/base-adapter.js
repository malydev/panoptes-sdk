/**
 * Base database adapter interface for Panoptes.
 * Interfaz base de adaptador de base de datos para Panoptes.
 *
 * @module adapters/base-adapter
 */

/**
 * Database adapter configuration.
 * Configuración del adaptador de base de datos.
 *
 * @typedef {Object} AdapterConfig
 * @property {string} [host] - Database host / Host de la base de datos
 * @property {string} [database] - Database name / Nombre de la base de datos
 * @property {string} [user] - Database user / Usuario de la base de datos
 * @property {string} [schema] - Database schema / Esquema de la base de datos
 * @property {string} [port] - Database port / Puerto de la base de datos
 */

/**
 * Query execution result.
 * Resultado de ejecución de consulta.
 *
 * @typedef {Object} QueryResult
 * @property {any} result - Query result / Resultado de la consulta
 * @property {number} durationMs - Query duration in ms / Duración de la consulta en ms
 * @property {number} [rowCount] - Rows affected / Filas afectadas
 * @property {boolean} success - Whether query succeeded / Si la consulta fue exitosa
 * @property {Error} [error] - Error if query failed / Error si la consulta falló
 */

/**
 * Base adapter class that all database adapters should extend.
 * Clase base de adaptador que todos los adaptadores de base de datos deben extender.
 *
 * @abstract
 */
export class BaseAdapter {
	/**
	 * @param {string} engineName - Database engine name / Nombre del motor de base de datos
	 * @param {AdapterConfig} config - Adapter configuration / Configuración del adaptador
	 */
	constructor(engineName, config = {}) {
		this.engineName = engineName;
		this.config = config;
	}

	/**
	 * Validates the client object.
	 * Valida el objeto cliente.
	 *
	 * @param {any} client - Database client / Cliente de base de datos
	 * @throws {Error} If client is invalid / Si el cliente es inválido
	 * @abstract
	 */
	validateClient(_client) {
		throw new Error("validateClient() must be implemented by subclass");
	}

	/**
	 * Extracts SQL and parameters from query arguments.
	 * Extrae SQL y parámetros de los argumentos de consulta.
	 *
	 * @param {any[]} args - Query arguments / Argumentos de consulta
	 * @returns {{ sql: string, params: any[] }} SQL and parameters / SQL y parámetros
	 * @abstract
	 */
	extractQueryInfo(_args) {
		throw new Error("extractQueryInfo() must be implemented by subclass");
	}

	/**
	 * Extracts row count from query result.
	 * Extrae el conteo de filas del resultado de consulta.
	 *
	 * @param {any} result - Query result / Resultado de consulta
	 * @returns {number | null} Row count / Conteo de filas
	 * @abstract
	 */
	extractRowCount(_result) {
		throw new Error("extractRowCount() must be implemented by subclass");
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
			dbHost: this.config.host,
			dbName: this.config.database,
			dbUser: this.config.user,
			dbSchema: this.config.schema,
		};
	}
}
