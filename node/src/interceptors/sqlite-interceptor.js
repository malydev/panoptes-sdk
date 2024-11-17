/**
 * SQLite database interceptor for Panoptes.
 * Interceptor de base de datos SQLite para Panoptes.
 *
 * @module interceptors/sqlite-interceptor
 */

import { SQLiteAdapter } from "../adapters/sqlite-adapter.js";
import { auditQuery } from "../core/audit-engine.js";

/**
 * Creates an audited SQLite client for better-sqlite3.
 * Crea un cliente SQLite auditado para better-sqlite3.
 * Wraps an existing better-sqlite3 Database instance to intercept and audit all queries.
 * Envuelve una instancia existente de better-sqlite3 Database para interceptar y auditar todas las consultas.
 *
 * @param {any} db - better-sqlite3 Database instance / Instancia de better-sqlite3 Database
 * @param {import("../adapters/base-adapter.js").AdapterConfig} dbOptions - Database connection options / Opciones de conexión a la base de datos
 * @returns {any} The same db, but intercepted / La misma db, pero interceptada
 * @throws {Error} If client is invalid / Si el cliente es inválido
 */
export function attachSQLiteInterceptor(db, dbOptions = {}) {
	const adapter = new SQLiteAdapter(dbOptions);
	adapter.validateClient(db);

	// better-sqlite3 uses prepare().run() pattern
	// better-sqlite3 usa el patrón prepare().run()
	const originalPrepare = db.prepare.bind(db);
	const originalExec = db.exec ? db.exec.bind(db) : null;

	// Intercept prepare() to wrap the returned statement
	// Interceptar prepare() para envolver el statement retornado
	db.prepare = (sql) => {
		const stmt = originalPrepare(sql);
		const originalRun = stmt.run.bind(stmt);
		const originalGet = stmt.get.bind(stmt);
		const originalAll = stmt.all.bind(stmt);

		// Wrap run()
		stmt.run = async (...params) => {
			const start = performance.now();
			let result;
			let success = true;
			let error;

			try {
				result = originalRun(...params);
			} catch (err) {
				success = false;
				error = err;
			}

			const end = performance.now();
			const durationMs = end - start;

			await auditQuery({
				db: adapter.getDbInfo(),
				sql,
				params,
				durationMs,
				rowCount: success ? adapter.extractRowCount(result) : null,
				success,
				error,
			});

			if (!success) {
				throw error;
			}

			return result;
		};

		// Wrap get()
		stmt.get = async (...params) => {
			const start = performance.now();
			let result;
			let success = true;
			let error;

			try {
				result = originalGet(...params);
			} catch (err) {
				success = false;
				error = err;
			}

			const end = performance.now();
			const durationMs = end - start;

			await auditQuery({
				db: adapter.getDbInfo(),
				sql,
				params,
				durationMs,
				rowCount: success ? 1 : null,
				success,
				error,
			});

			if (!success) {
				throw error;
			}

			return result;
		};

		// Wrap all()
		stmt.all = async (...params) => {
			const start = performance.now();
			let result;
			let success = true;
			let error;

			try {
				result = originalAll(...params);
			} catch (err) {
				success = false;
				error = err;
			}

			const end = performance.now();
			const durationMs = end - start;

			await auditQuery({
				db: adapter.getDbInfo(),
				sql,
				params,
				durationMs,
				rowCount: success ? adapter.extractRowCount(result) : null,
				success,
				error,
			});

			if (!success) {
				throw error;
			}

			return result;
		};

		return stmt;
	};

	// Intercept exec() for direct SQL execution
	// Interceptar exec() para ejecución directa de SQL
	if (originalExec) {
		db.exec = async (sql) => {
			const start = performance.now();
			let result;
			let success = true;
			let error;

			try {
				result = originalExec(sql);
			} catch (err) {
				success = false;
				error = err;
			}

			const end = performance.now();
			const durationMs = end - start;

			await auditQuery({
				db: adapter.getDbInfo(),
				sql,
				params: [],
				durationMs,
				rowCount: null,
				success,
				error,
			});

			if (!success) {
				throw error;
			}

			return result;
		};
	}

	return db;
}
