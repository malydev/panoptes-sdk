/**
 * Transport configuration for audit events.
 * Configuración de transporte para eventos de auditoría.
 *
 * @typedef {Object} PanoptesTransportsConfig
 * @property {Array<"console" | "file" | "http" | "database">} enabled - Enabled transports / Transportes habilitados
 * @property {Object} [file] - File transport config / Config de transporte a archivo
 * @property {string} [file.path] - Log file path / Ruta del archivo de logs
 * @property {Object} [http] - HTTP transport config / Config de transporte HTTP
 * @property {string} [http.endpoint] - HTTP endpoint URL / URL del endpoint HTTP
 * @property {Object} [database] - Database transport config / Config de transporte a base de datos
 * @property {any} [database.client] - Database client instance / Instancia del cliente de BD
 * @property {string} [database.engine] - Database engine type / Tipo de motor de BD
 * @property {string} [database.tableName] - Audit table name / Nombre de tabla de auditoría
 */

/**
 * Audit rules for a specific table.
 * Reglas de auditoría para una tabla específica.
 *
 * @typedef {Object} TableRules
 * @property {boolean} [enabled] - Enable/disable audit for this table / Habilitar/deshabilitar auditoría para esta tabla
 * @property {Array<"SELECT" | "INSERT" | "UPDATE" | "DELETE" | "DDL">} [auditedOperations] - Operations to audit / Operaciones a auditar
 * @property {"NORMAL" | "SENSITIVE" | "HIGH"} [sensitivityLevel] - Data sensitivity level / Nivel de sensibilidad de datos
 */

/**
 * Map of table names to their audit rules.
 * Mapa de nombres de tablas a sus reglas de auditoría.
 *
 * @typedef {Object.<string, TableRules>} TableRulesMap
 */

/**
 * Global operation-based audit rules.
 * Reglas de auditoría globales basadas en operaciones.
 *
 * @typedef {Object} OperationRules
 * @property {boolean} [auditSelect] - Audit SELECT queries / Auditar consultas SELECT
 * @property {boolean} [auditInsert] - Audit INSERT queries / Auditar consultas INSERT
 * @property {boolean} [auditUpdate] - Audit UPDATE queries / Auditar consultas UPDATE
 * @property {boolean} [auditDelete] - Audit DELETE queries / Auditar consultas DELETE
 * @property {boolean} [auditDDL] - Audit DDL queries / Auditar consultas DDL
 */

/**
 * Main Panoptes SDK configuration.
 * Configuración principal del SDK de Panoptes.
 *
 * @typedef {Object} PanoptesConfig
 * @property {string} appName - Application name / Nombre de la aplicación
 * @property {"dev" | "stage" | "prod"} environment - Environment / Entorno
 * @property {PanoptesTransportsConfig} transports - Transport configuration / Configuración de transportes
 * @property {TableRulesMap} tableRules - Table-specific rules / Reglas específicas por tabla
 * @property {OperationRules} operationRules - Operation-based rules / Reglas basadas en operaciones
 */

/** @type {PanoptesConfig} */
const defaultConfig = {
	appName: "panoptes-app",
	environment: "dev",
	transports: {
		enabled: ["console"],
		file: {
			path: "./logs/panoptes.log",
		},
		http: {
			endpoint: "",
		},
	},
	tableRules: {},
	operationRules: {
		auditSelect: true,
		auditInsert: true,
		auditUpdate: true,
		auditDelete: true,
		auditDDL: true,
	},
};

let currentConfig = structuredClone(defaultConfig);
let initialized = false;

/**
 * Initializes Panoptes SDK with user configuration.
 * Inicializa el SDK de Panoptes con la configuración del usuario.
 *
 * @param {Partial<PanoptesConfig>} [userConfig={}] - User configuration / Configuración del usuario
 * @throws {Error} If already initialized / Si ya está inicializado
 */
export function initConfig(userConfig = {}) {
	if (initialized) {
		throw new Error(
			"[Panoptes] initAudit() has already been called. Cannot be initialized twice.",
		);
	}

	const merged = mergeConfig(defaultConfig, userConfig);
	validateConfig(merged);
	currentConfig = merged;
	initialized = true;
}

/**
 * Returns the current configuration.
 * Retorna la configuración actual.
 * IMPORTANT: Returns a clone to prevent external mutations.
 * IMPORTANTE: Retorna un clon para evitar mutaciones externas.
 *
 * @returns {PanoptesConfig}
 */
export function getConfig() {
	return structuredClone(currentConfig);
}

/**
 * Checks if the SDK has been initialized.
 * Indica si el SDK ya fue inicializado.
 *
 * @returns {boolean}
 */
export function isInitialized() {
	return initialized;
}

/**
 * Updates table-specific audit rules.
 * Actualiza las reglas de auditoría por tabla.
 *
 * @param {TableRulesMap} tableRules - Table rules to merge / Reglas de tabla a mezclar
 * @throws {Error} If not initialized / Si no está inicializado
 */
export function setTableRules(tableRules) {
	if (!initialized) {
		throw new Error(
			"[Panoptes] Cannot call setTableRules() before initAudit().",
		);
	}

	currentConfig.tableRules = {
		...currentConfig.tableRules,
		...tableRules,
	};
}

/**
 * Updates global operation-based audit rules.
 * Actualiza las reglas de auditoría globales por tipo de operación.
 *
 * @param {Partial<OperationRules>} operationRules - Operation rules to merge / Reglas de operación a mezclar
 * @throws {Error} If not initialized / Si no está inicializado
 */
export function setOperationRules(operationRules) {
	if (!initialized) {
		throw new Error(
			"[Panoptes] Cannot call setOperationRules() before initAudit().",
		);
	}

	currentConfig.operationRules = {
		...currentConfig.operationRules,
		...operationRules,
	};
}

/**
 * Merges default config with user config.
 * Mezcla config por defecto con config de usuario.
 *
 * @param {PanoptesConfig} base
 * @param {Partial<PanoptesConfig>} overrides
 * @returns {PanoptesConfig}
 */
function mergeConfig(base, overrides) {
	return {
		...base,
		...overrides,
		transports: {
			...base.transports,
			...(overrides.transports || {}),
			file: {
				...base.transports.file,
				...(overrides.transports?.file || {}),
			},
			http: {
				...base.transports.http,
				...(overrides.transports?.http || {}),
			},
		},
		tableRules: {
			...base.tableRules,
			...(overrides.tableRules || {}),
		},
		operationRules: {
			...base.operationRules,
			...(overrides.operationRules || {}),
		},
	};
}

/**
 * Validates basic configuration.
 * Valida la configuración básica.
 *
 * @param {PanoptesConfig} config - Configuration to validate / Configuración a validar
 * @throws {Error} If configuration is invalid / Si la configuración es inválida
 */
function validateConfig(config) {
	if (!config.appName || typeof config.appName !== "string") {
		throw new Error(
			"[Panoptes] Invalid configuration: 'appName' is required and must be a string.",
		);
	}

	const allowedEnvs = ["dev", "stage", "prod"];
	if (!allowedEnvs.includes(config.environment)) {
		throw new Error(
			`[Panoptes] Invalid configuration: 'environment' must be one of ${allowedEnvs.join(", ")}.`,
		);
	}

	if (!config.transports || !Array.isArray(config.transports.enabled)) {
		throw new Error(
			"[Panoptes] Invalid configuration: 'transports.enabled' is required and must be an array, for example ['console'].",
		);
	}
}
