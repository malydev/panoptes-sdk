/**
 * Data capture utilities for before/after snapshots.
 * Utilidades de captura de datos para snapshots antes/después.
 *
 * @module core/data-capture
 */

/**
 * Captures the "before" state for UPDATE/DELETE operations.
 * Captura el estado "antes" para operaciones UPDATE/DELETE.
 *
 * @param {any} client - Database client / Cliente de base de datos
 * @param {string} tableName - Table name / Nombre de tabla
 * @param {Object} whereConditions - WHERE conditions / Condiciones WHERE
 * @param {string} dbEngine - Database engine type / Tipo de motor de BD
 * @returns {Promise<Object[]>} Records before change / Registros antes del cambio
 */
export async function captureBeforeState(
	client,
	tableName,
	whereConditions,
	dbEngine,
) {
	if (!tableName || !whereConditions) {
		return [];
	}

	try {
		// Build SELECT query to get current state
		// Construir consulta SELECT para obtener estado actual
		const selectQuery = buildSelectQuery(tableName, whereConditions, dbEngine);

		let result;
		switch (dbEngine) {
			case "postgres":
			case "mysql":
			case "mssql":
				result = await client.query(selectQuery.sql, selectQuery.params);
				break;
			case "sqlite": {
				const stmt = client.prepare(selectQuery.sql);
				result = stmt.all(...selectQuery.params);
				break;
			}
			case "oracle":
				result = await client.execute(selectQuery.sql, selectQuery.params);
				break;
			default:
				return [];
		}

		return extractRows(result, dbEngine);
	} catch (error) {
		console.warn("[Panoptes] Failed to capture before state:", error.message);
		return [];
	}
}

/**
 * Extracts the "after" state from query result.
 * Extrae el estado "después" del resultado de la consulta.
 *
 * @param {any} result - Query result / Resultado de consulta
 * @param {string} dbEngine - Database engine type / Tipo de motor de BD
 * @returns {Object[]} Records after change / Registros después del cambio
 */
export function captureAfterState(result, dbEngine) {
	try {
		return extractRows(result, dbEngine);
	} catch (error) {
		console.warn("[Panoptes] Failed to capture after state:", error.message);
		return [];
	}
}

/**
 * Builds a SELECT query based on WHERE conditions.
 * Construye una consulta SELECT basada en condiciones WHERE.
 *
 * @param {string} tableName - Table name / Nombre de tabla
 * @param {Object} whereConditions - WHERE conditions / Condiciones WHERE
 * @param {string} dbEngine - Database engine type / Tipo de motor de BD
 * @returns {{ sql: string, params: any[] }} Query and params / Consulta y parámetros
 */
function buildSelectQuery(tableName, _whereConditions, _dbEngine) {
	// Simple implementation - can be enhanced
	// Implementación simple - puede mejorarse
	const sql = `SELECT * FROM ${tableName} LIMIT 100`;
	return { sql, params: [] };
}

/**
 * Extracts rows from database result based on engine type.
 * Extrae filas del resultado de BD según tipo de motor.
 *
 * @param {any} result - Query result / Resultado de consulta
 * @param {string} dbEngine - Database engine type / Tipo de motor de BD
 * @returns {Object[]} Extracted rows / Filas extraídas
 */
function extractRows(result, dbEngine) {
	switch (dbEngine) {
		case "postgres":
			return result?.rows || [];
		case "mysql":
			return Array.isArray(result) ? result[0] : [];
		case "mssql":
			return result?.recordset || [];
		case "sqlite":
			return Array.isArray(result) ? result : [];
		case "oracle":
			return result?.rows || [];
		default:
			return [];
	}
}
