/**
 * MySQL database interceptor for Panoptes.
 * Interceptor de base de datos MySQL para Panoptes.
 *
 * @module interceptors/mysql-interceptor
 */

import { MySQLAdapter } from "../adapters/mysql-adapter.js";
import { attachGenericInterceptor } from "./generic-interceptor.js";

/**
 * Creates an audited MySQL client.
 * Crea un cliente MySQL auditado.
 * Wraps an existing mysql2 Connection/Pool instance to intercept and audit all queries.
 * Envuelve una instancia existente de mysql2 Connection/Pool para interceptar y auditar todas las consultas.
 *
 * @param {any} client - MySQL client created with mysql2 / Cliente MySQL creado con mysql2
 * @param {import("../adapters/base-adapter.js").AdapterConfig} dbOptions - Database connection options / Opciones de conexión a la base de datos
 * @returns {any} The same client, but intercepted / El mismo cliente, pero interceptado
 * @throws {Error} If client is invalid / Si el cliente es inválido
 */
export function attachMySQLInterceptor(client, dbOptions = {}) {
	const adapter = new MySQLAdapter(dbOptions);
	return attachGenericInterceptor(client, adapter);
}
