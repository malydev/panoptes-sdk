/**
 * User context storage using AsyncLocalStorage for request-scoped context.
 * Almacenamiento de contexto de usuario usando AsyncLocalStorage para contexto por request.
 *
 * @module context/context-store
 */

import { AsyncLocalStorage } from "node:async_hooks";

/**
 * User context information for audit trails.
 * Información de contexto de usuario para rastros de auditoría.
 *
 * @typedef {Object} UserContext
 * @property {"USER" | "SYSTEM" | "SERVICE"} [actorType] - Type of actor / Tipo de actor
 * @property {string | number} [appUserId] - Application user ID / ID de usuario de aplicación
 * @property {string} [appUsername] - Application username / Nombre de usuario de aplicación
 * @property {string[]} [appRoles] - User roles / Roles del usuario
 * @property {string | number} [tenantId] - Tenant ID for multi-tenancy / ID de tenant para multi-tenancy
 * @property {string} [ipAddress] - Client IP address / Dirección IP del cliente
 * @property {string} [userAgent] - User agent string / Cadena de user agent
 * @property {string} [requestId] - Request ID / ID de request
 * @property {string} [sessionId] - Session ID / ID de sesión
 * @property {string} [sourceApp] - Source application / Aplicación de origen
 */

/**
 * Internal context store structure.
 * Estructura interna del almacén de contexto.
 *
 * @typedef {Object} InternalContextStore
 * @property {UserContext | null} userContext - Current user context / Contexto de usuario actual
 */

const storage = new AsyncLocalStorage();

/**
 * Sets the user context for the current request.
 * Establece el contexto de usuario para la request actual.
 * Should be called at the beginning of each request (HTTP, message, job, etc.).
 * Debe llamarse al inicio de cada request (HTTP, mensaje, job, etc.).
 *
 * Example (Express) / Ejemplo (Express):
 * ```js
 * app.use((req, res, next) => {
 *   setUserContext({
 *     actorType: "USER",
 *     appUserId: req.user?.id,
 *     appUsername: req.user?.username,
 *     ipAddress: req.ip,
 *     userAgent: req.headers["user-agent"],
 *     requestId: req.id,
 *   });
 *   next();
 * });
 * ```
 *
 * @param {UserContext} userContext - User context to set / Contexto de usuario a establecer
 */
export function setUserContext(userContext) {
	const safeContext = sanitizeUserContext(userContext);

	storage.enterWith({ userContext: safeContext });
}

/**
 * Returns the current user context, or null if none exists.
 * Retorna el contexto de usuario actual, o null si no existe.
 *
 * @returns {UserContext | null} Current user context / Contexto de usuario actual
 */
export function getUserContext() {
	const store =
		/** @type {InternalContextStore | undefined} */
		(storage.getStore());

	if (!store || !store.userContext) {
		return null;
	}

	return structuredClone(store.userContext);
}

/**
 * Clears the current user context.
 * Limpia el contexto de usuario actual.
 * Useful at the end of a request to ensure cleanup.
 * Útil al final de la request para asegurar limpieza.
 */
export function clearUserContext() {
	storage.enterWith({ userContext: null });
}

/**
 * Executes a function with a specific user context.
 * Ejecuta una función con un contexto de usuario específico.
 * Useful for scope-based management instead of manual set/clear.
 * Útil para manejo basado en scope en lugar de set/clear manual.
 *
 * @param {UserContext} userContext - User context to use / Contexto de usuario a usar
 * @param {() => any | Promise<any>} fn - Function to execute / Función a ejecutar
 * @returns {any} Function result / Resultado de la función
 */
export function runWithUserContext(userContext, fn) {
	const safeContext = sanitizeUserContext(userContext);

	return storage.run(
		/** @type {InternalContextStore} */ ({ userContext: safeContext }),
		fn,
	);
}

/**
 * Normalizes and sanitizes user context.
 * Normaliza y limpia el contexto de usuario.
 *
 * @param {UserContext} userContext - User context to sanitize / Contexto de usuario a limpiar
 * @returns {UserContext} Sanitized context / Contexto limpio
 */
function sanitizeUserContext(userContext) {
	if (!userContext || typeof userContext !== "object") {
		return {};
	}

	const {
		actorType,
		appUserId,
		appUsername,
		appRoles,
		tenantId,
		ipAddress,
		userAgent,
		requestId,
		sessionId,
		sourceApp,
	} = userContext;

	return {
		actorType: normalizeActorType(actorType),
		appUserId: appUserId ?? undefined,
		appUsername: appUsername ?? undefined,
		appRoles: Array.isArray(appRoles) ? appRoles.slice() : undefined,
		tenantId: tenantId ?? undefined,
		ipAddress: ipAddress ?? undefined,
		userAgent: userAgent ?? undefined,
		requestId: requestId ?? undefined,
		sessionId: sessionId ?? undefined,
		sourceApp: sourceApp ?? undefined,
	};
}

/**
 * Normalizes actor type to valid values.
 * Normaliza el tipo de actor a valores válidos.
 *
 * @param {UserContext["actorType"]} actorType - Actor type to normalize / Tipo de actor a normalizar
 * @returns {UserContext["actorType"]} Normalized actor type / Tipo de actor normalizado
 */
function normalizeActorType(actorType) {
	if (!actorType) return "USER";

	const upper = String(actorType).toUpperCase();

	if (upper === "SYSTEM" || upper === "SERVICE" || upper === "USER") {
		return /** @type {UserContext["actorType"]} */ (upper);
	}

	return "USER";
}
