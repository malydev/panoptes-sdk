/**
 * Oracle usage example of Panoptes SDK
 * Ejemplo de uso de Oracle con el SDK de Panoptes
 */

import {
	createAuditedOracleClient,
	initAudit,
	setUserContext,
} from "@panoptes/sdk";
import oracledb from "oracledb";

// Initialize Panoptes / Inicializar Panoptes
initAudit({
	appName: "oracle-app",
	environment: "dev",
	transports: {
		enabled: ["console"],
	},
});

// Create Oracle connection / Crear conexión Oracle
const connection = await oracledb.getConnection({
	user: "system",
	password: "oracle",
	connectString: "localhost:1521/XEPDB1",
});

// Wrap with Panoptes / Envolver con Panoptes
const auditedConnection = createAuditedOracleClient(connection, {
	host: "localhost",
	database: "XEPDB1",
	user: "system",
	schema: "SYSTEM",
});

// Set user context / Establecer contexto de usuario
setUserContext({
	actorType: "USER",
	appUserId: 1,
	appUsername: "admin",
});

// Create table / Crear tabla
await auditedConnection.execute(`
  CREATE TABLE users (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) NOT NULL
  )
`);

// Insert data with bind variables / Insertar datos con variables de bind
const insertResult = await auditedConnection.execute(
	"INSERT INTO users (name, email) VALUES (:name, :email)",
	{
		name: "John Doe",
		email: "john@example.com",
	},
	{ autoCommit: true },
);
console.log("User created, rows affected:", insertResult.rowsAffected);

// Query data / Consultar datos
const selectResult = await auditedConnection.execute(
	"SELECT * FROM users WHERE name = :name",
	{ name: "John Doe" },
);
console.log("User:", selectResult.rows[0]);

// Get all users / Obtener todos los usuarios
const allUsersResult = await auditedConnection.execute("SELECT * FROM users");
console.log("All users:", allUsersResult.rows);

// Update user / Actualizar usuario
const updateResult = await auditedConnection.execute(
	"UPDATE users SET name = :newName WHERE name = :oldName",
	{
		newName: "Jane Doe",
		oldName: "John Doe",
	},
	{ autoCommit: true },
);
console.log("User updated, rows affected:", updateResult.rowsAffected);

// Delete user / Eliminar usuario
const deleteResult = await auditedConnection.execute(
	"DELETE FROM users WHERE name = :name",
	{ name: "Jane Doe" },
	{ autoCommit: true },
);
console.log("User deleted, rows affected:", deleteResult.rowsAffected);

// Clean up / Limpiar
await auditedConnection.execute("DROP TABLE users");

// Close connection / Cerrar conexión
await connection.close();
