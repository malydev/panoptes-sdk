/**
 * PostgreSQL database interceptor for Panoptes.
 * Interceptor de base de datos PostgreSQL para Panoptes.
 *
 * @module interceptors/postgres-interceptor
 */

import { PostgresAdapter } from "../adapters/postgres-adapter.js";
import { attachGenericInterceptor } from "./generic-interceptor.js";

/**
 * Creates an audited PostgreSQL client.
 * Crea un cliente PostgreSQL auditado.
 * Wraps an existing pg Client instance to intercept and audit all queries.
 * Envuelve una instancia existente de pg Client para interceptar y auditar todas las consultas.
 *
 * @param {import("pg").Client} client - PostgreSQL client created with new Client(...) / Cliente PostgreSQL creado con new Client(...)
 * @param {import("../adapters/base-adapter.js").AdapterConfig} dbOptions - Database connection options / Opciones de conexión a la base de datos
 * @returns {import("pg").Client} The same client, but intercepted / El mismo cliente, pero interceptado
 * @throws {Error} If client is invalid / Si el cliente es inválido
 */
export function attachPostgresInterceptor(client, dbOptions = {}) {
	const adapter = new PostgresAdapter(dbOptions);
	return attachGenericInterceptor(client, adapter);
}
