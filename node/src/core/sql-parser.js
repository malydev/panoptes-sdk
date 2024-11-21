/**
 * SQL parser for Panoptes audit engine.
 * Analizador SQL para el motor de auditoría de Panoptes.
 *
 * @module core/sql-parser
 */

/**
 * Parsed SQL query information.
 * Información de consulta SQL parseada.
 *
 * @typedef {Object} ParsedSql
 * @property {string} operationType - Operation type: "SELECT", "INSERT", "UPDATE", "DELETE", "DDL", "OTHER" / Tipo de operación
 * @property {string} [operationCategory] - Category: "DML", "DDL", "DCL", "TCL", "OTHER" / Categoría
 * @property {string} [mainTable] - Main table involved / Tabla principal involucrada
 * @property {string[]} [tablesInvolved] - All tables involved / Todas las tablas involucradas
 * @property {string} [normalizedSql] - Normalized SQL with placeholders / SQL normalizado con placeholders
 */

/**
 * Parses SQL to extract basic information.
 * Parsea el SQL para extraer información básica.
 * Simple version that can be improved with more sophisticated parsing.
 * Versión simple que puede mejorarse con análisis más sofisticado.
 *
 * @param {string} sql - SQL query to parse / Consulta SQL a parsear
 * @returns {ParsedSql} Parsed SQL information / Información SQL parseada
 */
export function parseSql(sql) {
	if (!sql || typeof sql !== "string") {
		return {
			operationType: "OTHER",
			operationCategory: "OTHER",
			mainTable: undefined,
			tablesInvolved: [],
			normalizedSql: "",
		};
	}

	const trimmed = sql.trim();
	const firstWord = trimmed.split(/\s+/)[0].toUpperCase();

	let operationType = "OTHER";
	let operationCategory = "OTHER";

	if (["SELECT", "INSERT", "UPDATE", "DELETE"].includes(firstWord)) {
		operationType = firstWord;
		operationCategory = "DML";
	} else if (["CREATE", "ALTER", "DROP", "TRUNCATE"].includes(firstWord)) {
		operationType = "DDL";
		operationCategory = "DDL";
	}

	// Basic heuristic for main table: word after FROM, INTO, or UPDATE
	// Heurística básica para tabla principal: palabra después de FROM, INTO o UPDATE
	let mainTable;
	const fromMatch = trimmed.match(/\bFROM\s+([a-zA-Z0-9_."`[\]]+)/i);
	const intoMatch = trimmed.match(/\bINTO\s+([a-zA-Z0-9_."`[\]]+)/i);
	const updateMatch = trimmed.match(/\bUPDATE\s+([a-zA-Z0-9_."`[\]]+)/i);
	const deleteMatch = trimmed.match(/\bDELETE\s+FROM\s+([a-zA-Z0-9_."`[\]]+)/i);

	if (fromMatch) {
		mainTable = cleanIdentifier(fromMatch[1]);
	} else if (intoMatch) {
		mainTable = cleanIdentifier(intoMatch[1]);
	} else if (updateMatch) {
		mainTable = cleanIdentifier(updateMatch[1]);
	} else if (deleteMatch) {
		mainTable = cleanIdentifier(deleteMatch[1]);
	}

	const tablesInvolved = [];
	if (mainTable) tablesInvolved.push(mainTable);

	// Basic heuristic for joins / Heurística básica para joins
	const joinRegex =
		/\b(?:INNER\s+|LEFT\s+|RIGHT\s+|FULL\s+|CROSS\s+)?JOIN\s+([a-zA-Z0-9_."`[\]]+)/gi;
	let joinMatch = joinRegex.exec(trimmed);
	while (joinMatch !== null) {
		const t = cleanIdentifier(joinMatch[1]);
		if (t && !tablesInvolved.includes(t)) {
			tablesInvolved.push(t);
		}
		joinMatch = joinRegex.exec(trimmed);
	}

	const normalizedSql = normalizeSql(trimmed);

	return {
		operationType,
		operationCategory,
		mainTable,
		tablesInvolved,
		normalizedSql,
	};
}

/**
 * Cleans SQL identifiers by removing quotes and brackets.
 * Limpia identificadores SQL removiendo comillas y corchetes.
 *
 * @param {string} id - Identifier to clean / Identificador a limpiar
 * @returns {string} Cleaned identifier / Identificador limpio
 */
function cleanIdentifier(id) {
	return id.replace(/["`[\]]/g, "").trim();
}

/**
 * Normalizes SQL by replacing literals with placeholders.
 * Normaliza SQL reemplazando literales con placeholders.
 *
 * @param {string} sql - SQL to normalize / SQL a normalizar
 * @returns {string} Normalized SQL / SQL normalizado
 */
function normalizeSql(sql) {
	return sql
		.replace(/'[^']*'/g, "?") // String literals / Literales de cadena
		.replace(/\b\d+(\.\d+)?\b/g, "?") // Numbers / Números
		.replace(/\s+/g, " ") // Multiple spaces / Espacios múltiples
		.trim();
}
