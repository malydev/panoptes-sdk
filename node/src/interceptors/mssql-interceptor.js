/**
 * Microsoft SQL Server database interceptor for Panoptes.
 * Interceptor de base de datos Microsoft SQL Server para Panoptes.
 *
 * @module interceptors/mssql-interceptor
 */

import { MSSQLAdapter } from "../adapters/mssql-adapter.js";
import { attachGenericInterceptor } from "./generic-interceptor.js";

/**
 * Creates an audited MSSQL client.
 * Crea un cliente MSSQL auditado.
 * Wraps an existing mssql ConnectionPool or Request instance to intercept and audit all queries.
 * Envuelve una instancia existente de mssql ConnectionPool o Request para interceptar y auditar todas las consultas.
 *
 * @param {any} client - MSSQL client created with mssql package / Cliente MSSQL creado con el paquete mssql
 * @param {import("../adapters/base-adapter.js").AdapterConfig} dbOptions - Database connection options / Opciones de conexión a la base de datos
 * @returns {any} The same client, but intercepted / El mismo cliente, pero interceptado
 * @throws {Error} If client is invalid / Si el cliente es inválido
 */
export function attachMSSQLInterceptor(client, dbOptions = {}) {
	const adapter = new MSSQLAdapter(dbOptions);
	return attachGenericInterceptor(client, adapter);
}
