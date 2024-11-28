/**
 * Panoptes SDK - Main entry point for SQL auditing.
 * SDK de Panoptes - Punto de entrada principal para auditoría SQL.
 *
 * @module panoptes-sdk
 */

import { getAuditTableSchema } from "./cli/create-audit-table.js";
import {
	clearUserContext as coreClearUserContext,
	runWithUserContext as coreRunWithUserContext,
	setUserContext as coreSetUserContext,
} from "./context/context-store.js";
import {
	setOperationRules as coreSetOperationRules,
	setTableRules as coreSetTableRules,
	initConfig,
} from "./core/config-manager.js";
import { attachMSSQLInterceptor } from "./interceptors/mssql-interceptor.js";
import { attachMySQLInterceptor } from "./interceptors/mysql-interceptor.js";
import { attachOracleInterceptor } from "./interceptors/oracle-interceptor.js";
import { attachPostgresInterceptor } from "./interceptors/postgres-interceptor.js";
import { attachSQLiteInterceptor } from "./interceptors/sqlite-interceptor.js";

/**
 * Initializes Panoptes SDK with configuration.
 * Inicializa el SDK de Panoptes con la configuración.
 * This is the main function that end users will call to set up audit tracking.
 * Esta es la función principal que los usuarios finales llamarán para configurar el seguimiento de auditoría.
 *
 * @param {import("./core/config-manager.js").PanoptesConfig} config - SDK configuration / Configuración del SDK
 */
export function initAudit(config) {
	initConfig(config);
}

/**
 * Defines table-specific audit rules.
 * Define reglas de auditoría específicas por tabla.
 *
 * @param {import("./core/config-manager.js").TableRulesMap} tableRules - Table rules map / Mapa de reglas por tabla
 */
export function setTableRules(tableRules) {
	coreSetTableRules(tableRules);
}

/**
 * Defines global operation-based audit rules.
 * Define reglas de auditoría globales por tipo de operación.
 *
 * @param {import("./core/config-manager.js").OperationRules} operationRules - Operation rules / Reglas de operación
 */
export function setOperationRules(operationRules) {
	coreSetOperationRules(operationRules);
}

/**
 * Sets the user context for the current request (who is performing the operation).
 * Establece el contexto de usuario para la petición actual (quién realiza la operación).
 *
 * @param {import("./context/context-store.js").UserContext} userContext - User context / Contexto de usuario
 */
export function setUserContext(userContext) {
	coreSetUserContext(userContext);
}

/**
 * Clears the current user context.
 * Limpia el contexto de usuario actual.
 */
export function clearUserContext() {
	coreClearUserContext();
}

/**
 * Runs a function with a specific user context.
 * Ejecuta una función con un contexto de usuario específico.
 *
 * @param {import("./context/context-store.js").UserContext} userContext - User context / Contexto de usuario
 * @param {() => any | Promise<any>} fn - Function to execute / Función a ejecutar
 * @returns {any} Function result / Resultado de la función
 */
export function runWithUserContext(userContext, fn) {
	return coreRunWithUserContext(userContext, fn);
}

/**
 * Wraps a PostgreSQL client with Panoptes audit capabilities.
 * Envuelve un cliente de PostgreSQL con capacidades de auditoría de Panoptes.
 *
 * @param {import("pg").Client} client - PostgreSQL client instance / Instancia del cliente PostgreSQL
 * @param {import("./adapters/base-adapter.js").AdapterConfig} dbInfo - Database connection info / Información de conexión a la base de datos
 * @returns {import("pg").Client} Audited client / Cliente auditado
 */
export function createAuditedPostgresClient(client, dbInfo = {}) {
	return attachPostgresInterceptor(client, dbInfo);
}

/**
 * Wraps a MySQL client with Panoptes audit capabilities.
 * Envuelve un cliente de MySQL con capacidades de auditoría de Panoptes.
 *
 * @param {any} client - MySQL client instance (mysql2) / Instancia del cliente MySQL (mysql2)
 * @param {import("./adapters/base-adapter.js").AdapterConfig} dbInfo - Database connection info / Información de conexión a la base de datos
 * @returns {any} Audited client / Cliente auditado
 */
export function createAuditedMySQLClient(client, dbInfo = {}) {
	return attachMySQLInterceptor(client, dbInfo);
}

/**
 * Wraps a Microsoft SQL Server client with Panoptes audit capabilities.
 * Envuelve un cliente de Microsoft SQL Server con capacidades de auditoría de Panoptes.
 *
 * @param {any} client - MSSQL client instance / Instancia del cliente MSSQL
 * @param {import("./adapters/base-adapter.js").AdapterConfig} dbInfo - Database connection info / Información de conexión a la base de datos
 * @returns {any} Audited client / Cliente auditado
 */
export function createAuditedMSSQLClient(client, dbInfo = {}) {
	return attachMSSQLInterceptor(client, dbInfo);
}

/**
 * Wraps a SQLite client with Panoptes audit capabilities.
 * Envuelve un cliente de SQLite con capacidades de auditoría de Panoptes.
 *
 * @param {any} db - SQLite database instance (better-sqlite3) / Instancia de base de datos SQLite (better-sqlite3)
 * @param {import("./adapters/base-adapter.js").AdapterConfig} dbInfo - Database connection info / Información de conexión a la base de datos
 * @returns {any} Audited database / Base de datos auditada
 */
export function createAuditedSQLiteClient(db, dbInfo = {}) {
	return attachSQLiteInterceptor(db, dbInfo);
}

/**
 * Wraps an Oracle client with Panoptes audit capabilities.
 * Envuelve un cliente de Oracle con capacidades de auditoría de Panoptes.
 *
 * @param {any} connection - Oracle connection instance (oracledb) / Instancia de conexión Oracle (oracledb)
 * @param {import("./adapters/base-adapter.js").AdapterConfig} dbInfo - Database connection info / Información de conexión a la base de datos
 * @returns {any} Audited connection / Conexión auditada
 */
export function createAuditedOracleClient(connection, dbInfo = {}) {
	return attachOracleInterceptor(connection, dbInfo);
}

/**
 * Gets the SQL schema to create audit table for specified database engine.
 * Obtiene el esquema SQL para crear la tabla de auditoría para el motor de BD especificado.
 *
 * @param {"postgres" | "mysql" | "mssql" | "sqlite" | "oracle"} engine - Database engine / Motor de base de datos
 * @returns {string} SQL CREATE TABLE statement / Sentencia SQL CREATE TABLE
 *
 * @example
 * ```javascript
 * import { generateAuditTableSQL } from '@panoptes/sdk';
 *
 * // Get schema for PostgreSQL
 * const sql = generateAuditTableSQL('postgres');
 * console.log(sql);
 *
 * // Execute it to create the table
 * await client.query(sql);
 * ```
 */
export function generateAuditTableSQL(engine) {
	return getAuditTableSchema(engine);
}
