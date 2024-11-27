/**
 * Example: Advanced features - before/after data, timestamps, etc.
 * Ejemplo: Características avanzadas - datos antes/después, timestamps, etc.
 */

import {
	createAuditedPostgresClient,
	generateAuditTableSQL,
	initAudit,
	setUserContext,
} from "@panoptes/sdk";
import { Client } from "pg";

// Setup databases / Configurar bases de datos
const auditDb = new Client({
	host: "localhost",
	database: "audit_logs",
	user: "postgres",
	password: "password",
});

const appDb = new Client({
	host: "localhost",
	database: "myapp",
	user: "postgres",
	password: "password",
});

await auditDb.connect();
await appDb.connect();

// Create audit table / Crear tabla de auditoría
await auditDb.query(generateAuditTableSQL("postgres"));

// Initialize with database transport / Inicializar con transporte de base de datos
initAudit({
	appName: "advanced-app",
	environment: "prod",
	transports: {
		enabled: ["console", "database"],
		database: {
			client: auditDb,
			engine: "postgres",
		},
	},
});

const auditedClient = createAuditedPostgresClient(appDb, {
	host: "localhost",
	database: "myapp",
});

// Set user context / Establecer contexto de usuario
setUserContext({
	actorType: "USER",
	appUserId: 123,
	appUsername: "john.doe",
	appRoles: ["admin", "editor"],
	tenantId: "tenant-456",
	ipAddress: "192.168.1.100",
	userAgent: "Mozilla/5.0...",
	requestId: "req-789",
	sessionId: "sess-abc",
});

// Example 1: UPDATE - captures before/after data
// Ejemplo 1: UPDATE - captura datos antes/después
console.log("\n📝 Example 1: UPDATE with before/after data");
await auditedClient.query(`
  UPDATE users
  SET email = 'newemail@example.com', updated_at = NOW()
  WHERE id = 1
`);

// Example 2: DELETE - captures data before deletion
// Ejemplo 2: DELETE - captura datos antes de eliminación
console.log("\n🗑️  Example 2: DELETE with before data");
await auditedClient.query(`
  DELETE FROM sessions WHERE user_id = 1 AND expires_at < NOW()
`);

// Example 3: INSERT - includes timestamp fields
// Ejemplo 3: INSERT - incluye campos de timestamp
console.log("\n➕ Example 3: INSERT with full timestamps");
await auditedClient.query(
	`
  INSERT INTO users (username, email) VALUES ($1, $2)
`,
	["jane.doe", "jane@example.com"],
);

// Query audit logs with all fields / Consultar logs con todos los campos
console.log("\n📊 Querying audit logs with timestamps...");
const logs = await auditDb.query(`
  SELECT
    id,
    timestamp,
    date,
    time,
    timestamp_unix,
    operation_type,
    main_table,
    actor_username,
    data_before,
    data_after,
    duration_ms,
    row_count,
    success
  FROM panoptes_audit_log
  ORDER BY timestamp DESC
  LIMIT 5
`);

console.table(
	logs.rows.map((row) => ({
		id: row.id,
		timestamp: row.timestamp,
		date: row.date,
		time: row.time,
		operation: row.operation_type,
		table: row.main_table,
		user: row.actor_username,
		duration: `${row.duration_ms}ms`,
		success: row.success ? "✓" : "✗",
		has_before: row.data_before ? "Yes" : "No",
		has_after: row.data_after ? "Yes" : "No",
	})),
);

// Example: Query by date / Ejemplo: Consultar por fecha
console.log("\n📅 Querying by date...");
const todayLogs = await auditDb.query(`
  SELECT
    operation_type,
    main_table,
    actor_username,
    COUNT(*) as count
  FROM panoptes_audit_log
  WHERE date = CURRENT_DATE
  GROUP BY operation_type, main_table, actor_username
  ORDER BY count DESC
`);

console.log("Operations today / Operaciones hoy:");
console.table(todayLogs.rows);

// Example: Find failed operations / Ejemplo: Encontrar operaciones fallidas
console.log("\n❌ Failed operations:");
const failedOps = await auditDb.query(`
  SELECT
    timestamp,
    operation_type,
    main_table,
    error_message
  FROM panoptes_audit_log
  WHERE success = FALSE
  ORDER BY timestamp DESC
  LIMIT 10
`);

if (failedOps.rows.length > 0) {
	console.table(failedOps.rows);
} else {
	console.log("No failed operations! / ¡No hay operaciones fallidas!");
}

// Clean up / Limpiar
await appDb.end();
await auditDb.end();

console.log("\n✅ Advanced features demo complete!");
console.log("✅ ¡Demo de características avanzadas completa!");
