/**
 * Complete usage example of Panoptes SDK
 * Ejemplo completo de uso del SDK de Panoptes
 */

import {
	createAuditedPostgresClient,
	initAudit,
	runWithUserContext,
	setOperationRules,
	setTableRules,
	setUserContext,
} from "@panoptes/sdk";
import express from "express";
import { Client } from "pg";

// ============================================================================
// 1. Initialize Panoptes SDK / Inicializar SDK de Panoptes
// ============================================================================

initAudit({
	appName: "my-awesome-app",
	environment: "prod",
	transports: {
		enabled: ["console", "file"],
		file: {
			path: "./logs/panoptes-audit.log",
		},
		http: {
			endpoint: "https://audit-collector.example.com/events",
		},
	},
});

// ============================================================================
// 2. Configure Audit Rules / Configurar Reglas de Auditoría
// ============================================================================

// Table-specific rules / Reglas específicas por tabla
setTableRules({
	users: {
		enabled: true,
		auditedOperations: ["INSERT", "UPDATE", "DELETE"],
		sensitivityLevel: "HIGH",
	},
	passwords: {
		enabled: true,
		auditedOperations: ["UPDATE", "DELETE"],
		sensitivityLevel: "SENSITIVE",
	},
	logs: {
		enabled: false, // Don't audit logs table / No auditar tabla de logs
	},
	sessions: {
		auditedOperations: ["DELETE"], // Only audit session deletions / Solo auditar eliminaciones de sesiones
	},
});

// Operation-based rules / Reglas basadas en operaciones
setOperationRules({
	auditSelect: false, // Don't audit SELECT queries globally / No auditar SELECT globalmente
	auditInsert: true,
	auditUpdate: true,
	auditDelete: true,
	auditDDL: true, // Always audit DDL operations / Siempre auditar operaciones DDL
});

// ============================================================================
// 3. Create Database Client / Crear Cliente de Base de Datos
// ============================================================================

const client = new Client({
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT || 5432,
	database: process.env.DB_NAME || "myapp",
	user: process.env.DB_USER || "postgres",
	password: process.env.DB_PASSWORD,
});

// Wrap with Panoptes audit / Envolver con auditoría de Panoptes
const auditedClient = createAuditedPostgresClient(client, {
	host: process.env.DB_HOST || "localhost",
	database: process.env.DB_NAME || "myapp",
	user: process.env.DB_USER || "postgres",
	schema: "public",
});

await auditedClient.connect();

// ============================================================================
// 4. Express Application with User Context / Aplicación Express con Contexto de Usuario
// ============================================================================

const app = express();
app.use(express.json());

// Middleware to set user context / Middleware para establecer contexto de usuario
app.use((req, _res, next) => {
	setUserContext({
		actorType: req.user ? "USER" : "SYSTEM",
		appUserId: req.user?.id,
		appUsername: req.user?.username,
		appRoles: req.user?.roles || [],
		tenantId: req.user?.tenantId,
		ipAddress: req.ip || req.socket.remoteAddress,
		userAgent: req.headers["user-agent"],
		requestId: req.id || `req-${Date.now()}`,
		sessionId: req.sessionID,
		sourceApp: "web-api",
	});
	next();
});

// ============================================================================
// 5. Example API Endpoints / Ejemplos de Endpoints de API
// ============================================================================

// Get user by ID / Obtener usuario por ID
app.get("/api/users/:id", async (req, res) => {
	try {
		// This query will be audited based on rules / Esta consulta será auditada según las reglas
		const result = await auditedClient.query(
			"SELECT * FROM users WHERE id = $1",
			[req.params.id],
		);

		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create new user / Crear nuevo usuario
app.post("/api/users", async (req, res) => {
	try {
		// INSERT will be audited / INSERT será auditado
		const result = await auditedClient.query(
			"INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
			[req.body.username, req.body.email],
		);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update user / Actualizar usuario
app.put("/api/users/:id", async (req, res) => {
	try {
		// UPDATE will be audited / UPDATE será auditado
		const result = await auditedClient.query(
			"UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *",
			[req.body.username, req.body.email, req.params.id],
		);

		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete user / Eliminar usuario
app.delete("/api/users/:id", async (req, res) => {
	try {
		// DELETE will be audited / DELETE será auditado
		await auditedClient.query("DELETE FROM users WHERE id = $1", [
			req.params.id,
		]);

		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// ============================================================================
// 6. Background Job with System Context / Trabajo en Segundo Plano con Contexto de Sistema
// ============================================================================

async function backgroundCleanupJob() {
	// Run with system context / Ejecutar con contexto de sistema
	await runWithUserContext(
		{
			actorType: "SYSTEM",
			appUserId: "cleanup-job",
			sourceApp: "background-scheduler",
			requestId: `job-${Date.now()}`,
		},
		async () => {
			// Delete old sessions / Eliminar sesiones antiguas
			await auditedClient.query(
				"DELETE FROM sessions WHERE last_activity < NOW() - INTERVAL '30 days'",
			);

			console.log("Cleanup job completed / Trabajo de limpieza completado");
		},
	);
}

// Run cleanup job every hour / Ejecutar trabajo de limpieza cada hora
setInterval(backgroundCleanupJob, 60 * 60 * 1000);

// ============================================================================
// 7. Start Server / Iniciar Servidor
// ============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Panoptes SDK initialized with audit tracking`);
	console.log(`Servidor ejecutándose en puerto ${PORT}`);
	console.log(`SDK de Panoptes inicializado con seguimiento de auditoría`);
});

// ============================================================================
// 8. Graceful Shutdown / Apagado Graceful
// ============================================================================

process.on("SIGTERM", async () => {
	console.log("Shutting down gracefully...");
	await auditedClient.end();
	process.exit(0);
});
