/**
 * MSSQL usage example of Panoptes SDK
 * Ejemplo de uso de MSSQL con el SDK de Panoptes
 */

import {
	createAuditedMSSQLClient,
	initAudit,
	setUserContext,
} from "@panoptes/sdk";
import sql from "mssql";

// Initialize Panoptes / Inicializar Panoptes
initAudit({
	appName: "mssql-app",
	environment: "dev",
	transports: {
		enabled: ["console"],
	},
});

// Create MSSQL connection / Crear conexión MSSQL
const pool = await new sql.ConnectionPool({
	server: "localhost",
	database: "mydb",
	user: "sa",
	password: "YourPassword123",
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
}).connect();

// Wrap with Panoptes / Envolver con Panoptes
const auditedClient = createAuditedMSSQLClient(pool, {
	host: "localhost",
	database: "mydb",
	user: "sa",
});

// Set user context / Establecer contexto de usuario
setUserContext({
	actorType: "USER",
	appUserId: 1,
	appUsername: "admin",
});

// Execute queries / Ejecutar consultas
const result = await auditedClient.query("SELECT * FROM users WHERE id = 1");
console.log("Users:", result.recordset);

await auditedClient.query(
	"INSERT INTO users (name, email) VALUES ('Jane', 'jane@example.com')",
);
console.log("User created / Usuario creado");

await pool.close();
