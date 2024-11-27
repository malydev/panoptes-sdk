/**
 * MySQL usage example of Panoptes SDK
 * Ejemplo de uso de MySQL con el SDK de Panoptes
 */

import {
	createAuditedMySQLClient,
	initAudit,
	setUserContext,
} from "@panoptes/sdk";
import mysql from "mysql2/promise";

// Initialize Panoptes / Inicializar Panoptes
initAudit({
	appName: "mysql-app",
	environment: "dev",
	transports: {
		enabled: ["console"],
	},
});

// Create MySQL connection / Crear conexión MySQL
const connection = await mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "mydb",
});

// Wrap with Panoptes / Envolver con Panoptes
const auditedClient = createAuditedMySQLClient(connection, {
	host: "localhost",
	database: "mydb",
	user: "root",
});

// Set user context / Establecer contexto de usuario
setUserContext({
	actorType: "USER",
	appUserId: 1,
	appUsername: "admin",
});

// Execute queries / Ejecutar consultas
const [rows] = await auditedClient.query(
	"SELECT * FROM users WHERE id = ?",
	[1],
);
console.log("User:", rows[0]);

await auditedClient.query("INSERT INTO users (name, email) VALUES (?, ?)", [
	"John",
	"john@example.com",
]);
console.log("User created / Usuario creado");

await connection.end();
