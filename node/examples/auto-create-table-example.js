/**
 * Example of automatic audit table creation
 * Ejemplo de creación automática de tabla de auditoría
 */

import { createAuditedPostgresClient, initAudit } from "@panoptes/sdk";
import { Client } from "pg";

// ============================================================================
// 1. Initialize Panoptes SDK with Auto-Create Table
// Inicializar SDK de Panoptes con Auto-Creación de Tabla
// ============================================================================

// Create separate client for audit database
// Crear cliente separado para base de datos de auditoría
const auditDbClient = new Client({
	host: process.env.AUDIT_DB_HOST || "localhost",
	port: process.env.AUDIT_DB_PORT || 5432,
	database: process.env.AUDIT_DB_NAME || "panoptes_audit",
	user: process.env.AUDIT_DB_USER || "postgres",
	password: process.env.AUDIT_DB_PASSWORD,
});

await auditDbClient.connect();

// Initialize with autoCreateTable enabled
// Inicializar con autoCreateTable habilitado
initAudit({
	appName: "auto-table-example",
	environment: "dev",
	transports: {
		enabled: ["console", "database"],
		database: {
			client: auditDbClient,
			engine: "postgres",
			tableName: "panoptes_audit_log", // Optional: custom table name / Opcional: nombre de tabla personalizado
			autoCreateTable: true, // ⭐ Auto-create table if it doesn't exist / ⭐ Crear tabla automáticamente si no existe
		},
	},
});

console.log("✓ Panoptes initialized with auto-create table");
console.log("✓ Panoptes inicializado con auto-creación de tabla");

// ============================================================================
// 2. Create Application Database Client
// Crear Cliente de Base de Datos de Aplicación
// ============================================================================

const appClient = new Client({
	host: process.env.APP_DB_HOST || "localhost",
	port: process.env.APP_DB_PORT || 5432,
	database: process.env.APP_DB_NAME || "myapp",
	user: process.env.APP_DB_USER || "postgres",
	password: process.env.APP_DB_PASSWORD,
});

const auditedClient = createAuditedPostgresClient(appClient, {
	host: process.env.APP_DB_HOST || "localhost",
	database: process.env.APP_DB_NAME || "myapp",
});

await auditedClient.connect();

// ============================================================================
// 3. Execute Some Queries - Audit Table Will Be Auto-Created on First Event
// Ejecutar Algunas Consultas - Tabla de Auditoría se Creará Automáticamente en Primer Evento
// ============================================================================

console.log("\n--- Executing queries / Ejecutando consultas ---\n");

// First query will trigger table creation if it doesn't exist
// Primera consulta disparará la creación de tabla si no existe
await auditedClient.query("SELECT NOW() as current_time");
console.log("✓ Query 1 executed");

await auditedClient.query("SELECT * FROM users WHERE id = $1", [1]);
console.log("✓ Query 2 executed");

// ============================================================================
// 4. Verify Audit Table Was Created
// Verificar que la Tabla de Auditoría Fue Creada
// ============================================================================

console.log(
	"\n--- Verifying audit table / Verificando tabla de auditoría ---\n",
);

const result = await auditDbClient.query(`
  SELECT COUNT(*) as audit_count
  FROM panoptes_audit_log
`);

console.log(`✓ Audit table exists with ${result.rows[0].audit_count} records`);
console.log(
	`✓ Tabla de auditoría existe con ${result.rows[0].audit_count} registros`,
);

// ============================================================================
// 5. Check Table Schema
// Verificar Esquema de Tabla
// ============================================================================

const schemaResult = await auditDbClient.query(`
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'panoptes_audit_log'
  ORDER BY ordinal_position
  LIMIT 10
`);

console.log("\n--- Table schema sample / Muestra de esquema de tabla ---\n");
for (const row of schemaResult.rows) {
	console.log(`  ${row.column_name}: ${row.data_type}`);
}

// ============================================================================
// 6. Cleanup
// Limpieza
// ============================================================================

await auditedClient.end();
await auditDbClient.end();

console.log("\n✓ Example completed / Ejemplo completado");
console.log("✓ Audit table was automatically created and populated");
console.log("✓ Tabla de auditoría fue creada y poblada automáticamente");
