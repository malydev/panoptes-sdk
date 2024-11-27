/**
 * Example: Saving audit logs to a separate database
 * Ejemplo: Guardando logs de auditoría en una base de datos separada
 */

import {
	createAuditedPostgresClient,
	generateAuditTableSQL,
	initAudit,
} from "@panoptes/sdk";
import { Client } from "pg";

// Step 1: Create audit database connection
// Paso 1: Crear conexión a base de datos de auditoría
const auditDbClient = new Client({
	host: "localhost",
	port: 5432,
	database: "audit_logs", // Separate database for audits / BD separada para auditorías
	user: "audit_user",
	password: "audit_password",
});

await auditDbClient.connect();

// Step 2: Create audit table (run once)
// Paso 2: Crear tabla de auditoría (ejecutar una vez)
const createTableSQL = generateAuditTableSQL("postgres");
console.log("Creating audit table... / Creando tabla de auditoría...");
await auditDbClient.query(createTableSQL);
console.log("✓ Audit table created! / ¡Tabla de auditoría creada!");

// Step 3: Initialize Panoptes with database transport
// Paso 3: Inicializar Panoptes con transporte de base de datos
initAudit({
	appName: "my-app",
	environment: "prod",
	transports: {
		enabled: ["console", "database"], // Enable database transport / Habilitar transporte de BD
		database: {
			client: auditDbClient, // Pass the audit DB client / Pasar el cliente de BD de auditoría
			engine: "postgres", // Database engine / Motor de base de datos
			tableName: "panoptes_audit_log", // Table name (optional) / Nombre de tabla (opcional)
		},
	},
});

// Step 4: Create connection to application database
// Paso 4: Crear conexión a base de datos de aplicación
const appDbClient = new Client({
	host: "localhost",
	port: 5432,
	database: "my_app", // Your application database / Tu base de datos de aplicación
	user: "app_user",
	password: "app_password",
});

await appDbClient.connect();

// Step 5: Wrap application database client
// Paso 5: Envolver cliente de base de datos de aplicación
const auditedClient = createAuditedPostgresClient(appDbClient, {
	host: "localhost",
	database: "my_app",
	user: "app_user",
});

// Step 6: Use as normal - audits are saved to separate database!
// Paso 6: Usar normalmente - ¡las auditorías se guardan en BD separada!
await auditedClient.query("SELECT * FROM users WHERE id = $1", [1]);
await auditedClient.query(
	"UPDATE users SET last_login = NOW() WHERE id = $1",
	[1],
);
await auditedClient.query("DELETE FROM sessions WHERE expired = true");

console.log("✓ All operations audited to separate database!");
console.log("✓ ¡Todas las operaciones auditadas en base de datos separada!");

// Query audit logs
// Consultar logs de auditoría
const auditLogs = await auditDbClient.query(`
  SELECT
    timestamp,
    operation_type,
    main_table,
    actor_username,
    success,
    sql_raw
  FROM panoptes_audit_log
  ORDER BY timestamp DESC
  LIMIT 10
`);

console.log("\nRecent audit logs / Logs de auditoría recientes:");
console.table(auditLogs.rows);

// Clean up / Limpiar
await appDbClient.end();
await auditDbClient.end();
