/**
 * Event builder for creating audit event payloads.
 * Constructor de eventos para crear payloads de eventos de auditoría.
 *
 * @module core/event-builder
 */

/**
 * @typedef {import("./config-manager.js").PanoptesConfig} PanoptesConfig
 */
/**
 * @typedef {import("./sql-parser.js").ParsedSql} ParsedSql
 */
/**
 * @typedef {import("../context/context-store.js").UserContext} UserContext
 */

/**
 * Input for building audit event.
 * Entrada para construir evento de auditoría.
 *
 * @typedef {Object} BuildEventInput
 * @property {PanoptesConfig} config - Panoptes configuration / Configuración de Panoptes
 * @property {import("./audit-engine.js").DbInfo} db - Database info / Información de base de datos
 * @property {string} sql - SQL query / Consulta SQL
 * @property {any[] | undefined} params - Query parameters / Parámetros de consulta
 * @property {number | undefined} durationMs - Query duration / Duración de consulta
 * @property {number | undefined} rowCount - Rows affected / Filas afectadas
 * @property {boolean} success - Query success / Éxito de consulta
 * @property {Error | undefined} error - Query error / Error de consulta
 * @property {UserContext | null} userContext - User context / Contexto de usuario
 * @property {ParsedSql} parsedSql - Parsed SQL / SQL parseado
 * @property {string} reason - Audit reason / Razón de auditoría
 * @property {Object[] | undefined} beforeData - Data before change (UPDATE/DELETE) / Datos antes del cambio
 * @property {Object[] | undefined} afterData - Data after change (UPDATE) / Datos después del cambio
 */

/**
 * Builds the complete audit event that will be sent to transports.
 * Construye el evento de auditoría completo que será enviado a los transports.
 *
 * @param {BuildEventInput} input - Event build input / Entrada para construir evento
 * @returns {Object} Audit event / Evento de auditoría
 */
export function buildAuditEvent(input) {
	const {
		config,
		db,
		sql,
		params,
		durationMs,
		rowCount,
		success,
		error,
		userContext,
		parsedSql,
		reason,
		beforeData,
		afterData,
	} = input;

	const now = new Date();
	const timestamp = now.toISOString();

	return {
		meta: {
			appName: config.appName,
			environment: config.environment,
			sourceApp: userContext?.sourceApp,
			timestamp,
			timestampUnix: Math.floor(now.getTime() / 1000),
			date: now.toISOString().split("T")[0],
			time: now.toTimeString().split(" ")[0],
			durationMs: durationMs ?? null,
			reason,
		},
		db: {
			engine: db.dbEngine,
			host: db.dbHost,
			name: db.dbName,
			user: db.dbUser,
			schema: db.dbSchema,
		},
		operation: {
			type: parsedSql.operationType,
			category: parsedSql.operationCategory,
			mainTable: parsedSql.mainTable,
			tablesInvolved: parsedSql.tablesInvolved,
		},
		sql: {
			raw: sql,
			normalized: parsedSql.normalizedSql,
			parameters: params ?? [],
			rowCount: rowCount ?? null,
			success,
			errorCode: error ? error.code || undefined : undefined,
			errorMessage: error ? error.message : undefined,
		},
		data: {
			before: beforeData && beforeData.length > 0 ? beforeData : undefined,
			after: afterData && afterData.length > 0 ? afterData : undefined,
		},
		actor: {
			actorType: userContext?.actorType,
			appUserId: userContext?.appUserId,
			appUsername: userContext?.appUsername,
			appRoles: userContext?.appRoles,
			tenantId: userContext?.tenantId,
		},
		request: {
			ipAddress: userContext?.ipAddress,
			userAgent: userContext?.userAgent,
			requestId: userContext?.requestId,
			sessionId: userContext?.sessionId,
		},
	};
}
