/**
 * Rules engine for determining which queries should be audited.
 * Motor de reglas para determinar qué consultas deben ser auditadas.
 *
 * @module core/rules-engine
 */

/**
 * @typedef {import("./config-manager.js").PanoptesConfig} PanoptesConfig
 */

/**
 * @typedef {import("./sql-parser.js").ParsedSql} ParsedSql
 */

/**
 * Input for audit decision logic.
 * Entrada para la lógica de decisión de auditoría.
 *
 * @typedef {Object} ShouldAuditInput
 * @property {PanoptesConfig} config - Panoptes configuration / Configuración de Panoptes
 * @property {import("./audit-engine.js").DbInfo} db - Database info / Información de base de datos
 * @property {ParsedSql} parsedSql - Parsed SQL / SQL parseado
 * @property {import("../context/context-store.js").UserContext | null} userContext - User context / Contexto de usuario
 * @property {boolean} success - Whether query succeeded / Si la consulta fue exitosa
 * @property {Error | undefined} error - Query error if any / Error de consulta si existe
 */

/**
 * Result of audit decision.
 * Resultado de decisión de auditoría.
 *
 * @typedef {Object} ShouldAuditResult
 * @property {boolean} shouldAudit - Whether to audit / Si se debe auditar
 * @property {string} reason - Reason for decision / Razón de la decisión
 */

/**
 * Decides whether a query should be audited based on configured rules.
 * Decide si se debe auditar una query basándose en las reglas configuradas.
 *
 * @param {ShouldAuditInput} input - Audit decision input / Entrada para decisión de auditoría
 * @returns {ShouldAuditResult} Audit decision / Decisión de auditoría
 */
export function shouldAudit(input) {
	const { config, parsedSql } = input;
	const op = parsedSql.operationType;

	// 1) Primero miramos las reglas globales por operación
	const opRules = config.operationRules;

	if (op === "SELECT" && opRules.auditSelect === false) {
		return { shouldAudit: false, reason: "operationRules:SELECT=false" };
	}
	if (op === "INSERT" && opRules.auditInsert === false) {
		return { shouldAudit: false, reason: "operationRules:INSERT=false" };
	}
	if (op === "UPDATE" && opRules.auditUpdate === false) {
		return { shouldAudit: false, reason: "operationRules:UPDATE=false" };
	}
	if (op === "DELETE" && opRules.auditDelete === false) {
		return { shouldAudit: false, reason: "operationRules:DELETE=false" };
	}
	if (op === "DDL" && opRules.auditDDL === false) {
		return { shouldAudit: false, reason: "operationRules:DDL=false" };
	}

	// 2) Luego miramos reglas por tabla (si hay mainTable)
	if (parsedSql.mainTable && config.tableRules) {
		const tableRule = config.tableRules[parsedSql.mainTable];

		if (tableRule) {
			if (tableRule.enabled === false) {
				return {
					shouldAudit: false,
					reason: `tableRules:${parsedSql.mainTable}:disabled`,
				};
			}

			if (
				Array.isArray(tableRule.auditedOperations) &&
				tableRule.auditedOperations.length > 0
			) {
				if (!tableRule.auditedOperations.includes(op)) {
					return {
						shouldAudit: false,
						reason: `tableRules:${parsedSql.mainTable}:op_not_in_auditedOperations`,
					};
				}
			}
		}
	}

	// 3) En el futuro: podrías agregar más condiciones (errores siempre auditados, etc.)

	return { shouldAudit: true, reason: "default:allowed" };
}
