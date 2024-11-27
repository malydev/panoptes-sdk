/**
 * SQLite usage example of Panoptes SDK
 * Ejemplo de uso de SQLite con el SDK de Panoptes
 */

import {
	createAuditedSQLiteClient,
	initAudit,
	setUserContext,
} from "@panoptes/sdk";
import Database from "better-sqlite3";

// Initialize Panoptes / Inicializar Panoptes
initAudit({
	appName: "sqlite-app",
	environment: "dev",
	transports: {
		enabled: ["console"],
	},
});

// Create SQLite database / Crear base de datos SQLite
const db = new Database("mydb.sqlite");

// Wrap with Panoptes / Envolver con Panoptes
const auditedDb = createAuditedSQLiteClient(db, {
	database: "mydb.sqlite",
	filename: "mydb.sqlite",
});

// Set user context / Establecer contexto de usuario
setUserContext({
	actorType: "USER",
	appUserId: 1,
	appUsername: "admin",
});

// Create table / Crear tabla
auditedDb.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);

// Insert data / Insertar datos
const insertStmt = auditedDb.prepare(
	"INSERT INTO users (name, email) VALUES (?, ?)",
);
const info = insertStmt.run("John Doe", "john@example.com");
console.log("User created with ID:", info.lastInsertRowid);

// Query data / Consultar datos
const selectStmt = auditedDb.prepare("SELECT * FROM users WHERE id = ?");
const user = selectStmt.get(info.lastInsertRowid);
console.log("User:", user);

// Get all users / Obtener todos los usuarios
const allUsersStmt = auditedDb.prepare("SELECT * FROM users");
const allUsers = allUsersStmt.all();
console.log("All users:", allUsers);

// Update user / Actualizar usuario
const updateStmt = auditedDb.prepare("UPDATE users SET name = ? WHERE id = ?");
updateStmt.run("Jane Doe", info.lastInsertRowid);
console.log("User updated / Usuario actualizado");

// Delete user / Eliminar usuario
const deleteStmt = auditedDb.prepare("DELETE FROM users WHERE id = ?");
deleteStmt.run(info.lastInsertRowid);
console.log("User deleted / Usuario eliminado");

// Close database / Cerrar base de datos
db.close();
