/**
 * Core audit engine for Panoptes SDK.
 * Motor de auditoría principal para el SDK de Panoptes.
 *
 * @module core/audit-engine
 */

import { getUserContext } from "../context/context-store.js";
import { dispatchAuditEvent } from "../transport/transport-dispatcher.js";
import { getConfig, isInitialized } from "./config-manager.js";
import { buildAuditEvent } from "./event-builder.js";
import { shouldAudit } from "./rules-engine.js";
import { parseSql } from "./sql-parser.js";

/**
 * Database connection information.
 * Información de conexión a la base de datos.
 *
 * @typedef {Object} DbInfo
 * @property {string} dbEngine - Database engine type (e.g. "postgres", "mysql", "mssql") / Tipo de motor de base de datos
 * @property {string} [dbHost] - Database host / Host de la base de datos
 * @property {string} [dbName] - Database name / Nombre de la base de datos
 * @property {string} [dbUser] - Database user / Usuario de la base de datos
 * @property {string} [dbSchema] - Database schema / Esquema de la base de datos
 */

/**
 * Payload for audit query operation.
 * Payload para operación de auditoría de query.
 *
 * @typedef {Object} AuditQueryPayload
 * @property {DbInfo} db - Database info / Información de la base de datos
 * @property {string} sql - SQL query / Consulta SQL
 * @property {any[]} [params] - Query parameters / Parámetros de la consulta
 * @property {number} [durationMs] - Query duration in milliseconds / Duración de la consulta en milisegundos
 * @property {number} [rowCount] - Number of affected rows / Número de filas afectadas
 * @property {boolean} success - Whether query succeeded / Si la consulta fue exitosa
 * @property {Error} [error] - Error if query failed / Error si la consulta falló
 */

/**
 * Main entry point for auditing a database query.
 * Punto de entrada principal para auditar una consulta de base de datos.
 * This function is called by database interceptors.
 * Esta función es llamada por los interceptores de base de datos.
 *
 * @param {AuditQueryPayload} payload - Query audit payload / Payload de auditoría de consulta
 */
export async function auditQuery(payload) {
	if (!isInitialized()) {
		return;
	}

	const config = getConfig();

	const userContext = getUserContext();

	const parsed = parseSql(payload.sql);

	const auditDecision = shouldAudit({
		config,
		db: payload.db,
		parsedSql: parsed,
		userContext,
		success: payload.success,
		error: payload.error,
	});

	if (!auditDecision.shouldAudit) {
		return;
	}

	const event = buildAuditEvent({
		config,
		db: payload.db,
		sql: payload.sql,
		params: payload.params,
		durationMs: payload.durationMs,
		rowCount: payload.rowCount,
		success: payload.success,
		error: payload.error,
		userContext,
		parsedSql: parsed,
		reason: auditDecision.reason,
	});

	await dispatchAuditEvent(event, config);
}
