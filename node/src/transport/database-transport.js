/**
 * Database transport for storing audit events in a separate database.
 * Transporte de base de datos para almacenar eventos de auditoría en una BD separada.
 *
 * @module transport/database-transport
 */

import { getAuditTableSchema } from "../cli/create-audit-table.js";

// Track which databases have had their tables verified
// Rastrear qué bases de datos han tenido sus tablas verificadas
const verifiedDatabases = new Set();

/**
 * Sends audit event to database.
 * Envía evento de auditoría a la base de datos.
 *
 * @param {Object} event - Audit event / Evento de auditoría
 * @param {Object} config - Transport configuration / Configuración de transporte
 */
export async function sendToDatabase(event, config) {
	if (!config.database || !config.database.client) {
		console.warn(
			"[Panoptes][database-transport] No database client configured",
		);
		return;
	}

	const {
		client,
		tableName = "panoptes_audit_log",
		engine,
		autoCreateTable = false,
	} = config.database;

	try {
		// Auto-create table if enabled and not yet verified
		// Crear tabla automáticamente si está habilitado y no se ha verificado
		if (autoCreateTable && !verifiedDatabases.has(client)) {
			await ensureAuditTableExists(client, tableName, engine);
			verifiedDatabases.add(client);
		}

		const insertData = prepareInsertData(event);
		await insertAuditRecord(client, tableName, insertData, engine);
	} catch (error) {
		console.error(
			"[Panoptes][database-transport] Failed to insert audit record:",
			error.message,
		);
	}
}

/**
 * Ensures audit table exists, creates it if it doesn't.
 * Asegura que la tabla de auditoría existe, la crea si no existe.
 *
 * @param {any} client - Database client / Cliente de base de datos
 * @param {string} tableName - Table name / Nombre de tabla
 * @param {string} engine - Database engine / Motor de base de datos
 */
async function ensureAuditTableExists(client, tableName, engine) {
	try {
		const tableExists = await checkTableExists(client, tableName, engine);

		if (!tableExists) {
			console.log(
				`[Panoptes][database-transport] Creating audit table '${tableName}'...`,
			);
			const createSQL = getAuditTableSchema(engine);
			await executeCreateTable(client, createSQL, engine);
			console.log(
				`[Panoptes][database-transport] ✓ Audit table '${tableName}' created successfully`,
			);
		} else {
			console.log(
				`[Panoptes][database-transport] ✓ Audit table '${tableName}' already exists`,
			);
		}
	} catch (error) {
		console.error(
			"[Panoptes][database-transport] Failed to create audit table:",
			error.message,
		);
		throw error;
	}
}

/**
 * Checks if audit table exists.
 * Verifica si la tabla de auditoría existe.
 *
 * @param {any} client - Database client / Cliente de base de datos
 * @param {string} tableName - Table name / Nombre de tabla
 * @param {string} engine - Database engine / Motor de base de datos
 * @returns {Promise<boolean>} True if table exists / True si la tabla existe
 */
async function checkTableExists(client, tableName, engine) {
	let query;
	let result;

	switch (engine) {
		case "postgres":
			query =
				"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)";
			result = await client.query(query, [tableName]);
			return result.rows[0].exists;

		case "mysql":
			query = "SHOW TABLES LIKE ?";
			[result] = await client.query(query, [tableName]);
			return Array.isArray(result) && result.length > 0;

		case "mssql":
			query = `SELECT OBJECT_ID('${tableName}', 'U') AS table_id`;
			result = await client.query(query);
			return result.recordset[0].table_id !== null;

		case "sqlite": {
			query = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
			const stmt = client.prepare(query);
			result = stmt.get(tableName);
			return result !== undefined;
		}

		case "oracle":
			query =
				"SELECT COUNT(*) as cnt FROM user_tables WHERE table_name = UPPER(:1)";
			result = await client.execute(query, [tableName]);
			return result.rows[0][0] > 0;

		default:
			throw new Error(`Unsupported database engine: ${engine}`);
	}
}

/**
 * Executes CREATE TABLE SQL.
 * Ejecuta SQL CREATE TABLE.
 *
 * @param {any} client - Database client / Cliente de base de datos
 * @param {string} createSQL - CREATE TABLE SQL / SQL CREATE TABLE
 * @param {string} engine - Database engine / Motor de base de datos
 */
async function executeCreateTable(client, createSQL, engine) {
	switch (engine) {
		case "postgres":
		case "mysql":
		case "mssql":
			await client.query(createSQL);
			break;

		case "sqlite":
			client.exec(createSQL);
			break;

		case "oracle":
			await client.execute(createSQL);
			break;

		default:
			throw new Error(`Unsupported database engine: ${engine}`);
	}
}

/**
 * Prepares data for database insertion.
 * Prepara datos para inserción en base de datos.
 *
 * @param {Object} event - Audit event / Evento de auditoría
 * @returns {Object} Prepared data / Datos preparados
 */
function prepareInsertData(event) {
	return {
		// Meta
		app_name: event.meta.appName,
		environment: event.meta.environment,
		timestamp: event.meta.timestamp,
		timestamp_unix: event.meta.timestampUnix,
		date: event.meta.date,
		time: event.meta.time,
		duration_ms: event.meta.durationMs,
		reason: event.meta.reason,

		// Database
		db_engine: event.db.engine,
		db_host: event.db.host,
		db_name: event.db.name,
		db_user: event.db.user,
		db_schema: event.db.schema,

		// Operation
		operation_type: event.operation.type,
		operation_category: event.operation.category,
		main_table: event.operation.mainTable,
		tables_involved: JSON.stringify(event.operation.tablesInvolved),

		// SQL
		sql_raw: event.sql.raw,
		sql_normalized: event.sql.normalized,
		sql_parameters: JSON.stringify(event.sql.parameters),
		row_count: event.sql.rowCount,
		success: event.sql.success,
		error_code: event.sql.errorCode,
		error_message: event.sql.errorMessage,

		// Data (before/after)
		data_before: event.data?.before ? JSON.stringify(event.data.before) : null,
		data_after: event.data?.after ? JSON.stringify(event.data.after) : null,

		// Actor
		actor_type: event.actor.actorType,
		actor_user_id: event.actor.appUserId,
		actor_username: event.actor.appUsername,
		actor_roles: JSON.stringify(event.actor.appRoles),
		actor_tenant_id: event.actor.tenantId,

		// Request
		request_ip: event.request.ipAddress,
		request_user_agent: event.request.userAgent,
		request_id: event.request.requestId,
		request_session_id: event.request.sessionId,
	};
}

/**
 * Inserts audit record into database.
 * Inserta registro de auditoría en la base de datos.
 *
 * @param {any} client - Database client / Cliente de base de datos
 * @param {string} tableName - Table name / Nombre de tabla
 * @param {Object} data - Data to insert / Datos a insertar
 * @param {string} engine - Database engine / Motor de base de datos
 */
async function insertAuditRecord(client, tableName, data, engine) {
	const columns = Object.keys(data).filter((k) => data[k] !== undefined);
	const values = columns.map((k) => data[k]);

	let query;
	let params;

	switch (engine) {
		case "postgres":
			query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${columns.map((_, i) => `$${i + 1}`).join(", ")})`;
			params = values;
			await client.query(query, params);
			break;

		case "mysql":
			query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;
			params = values;
			await client.query(query, params);
			break;

		case "mssql":
			query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${columns.map((_, i) => `@param${i}`).join(", ")})`;
			// MSSQL requires parameter binding
			await client.query(query, values);
			break;

		case "sqlite": {
			query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;
			const stmt = client.prepare(query);
			stmt.run(...values);
			break;
		}

		case "oracle":
			query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${columns.map((_, i) => `:${i + 1}`).join(", ")})`;
			await client.execute(query, values, { autoCommit: true });
			break;

		default:
			throw new Error(`Unsupported database engine: ${engine}`);
	}
}
