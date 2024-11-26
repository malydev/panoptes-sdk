#!/usr/bin/env node

/**
 * CLI tool to create Panoptes audit tables.
 * Herramienta CLI para crear tablas de auditoría de Panoptes.
 *
 * Usage / Uso:
 * ```
 * npx panoptes-create-table --engine postgres --output audit-table.sql
 * npx panoptes-create-table --engine mysql --execute --host localhost --database mydb
 * ```
 */

/**
 * SQL templates for creating audit tables.
 * Plantillas SQL para crear tablas de auditoría.
 */
const TABLE_SCHEMAS = {
	postgres: `
-- Panoptes Audit Log Table for PostgreSQL
-- Tabla de Auditoría de Panoptes para PostgreSQL

CREATE TABLE IF NOT EXISTS panoptes_audit_log (
  id BIGSERIAL PRIMARY KEY,

  -- Meta information / Información meta
  app_name VARCHAR(255) NOT NULL,
  environment VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  timestamp_unix BIGINT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration_ms NUMERIC(10, 2),
  reason VARCHAR(255),

  -- Database information / Información de base de datos
  db_engine VARCHAR(50) NOT NULL,
  db_host VARCHAR(255),
  db_name VARCHAR(255),
  db_user VARCHAR(255),
  db_schema VARCHAR(255),

  -- Operation information / Información de operación
  operation_type VARCHAR(50) NOT NULL,
  operation_category VARCHAR(50),
  main_table VARCHAR(255),
  tables_involved JSONB,

  -- SQL information / Información SQL
  sql_raw TEXT NOT NULL,
  sql_normalized TEXT,
  sql_parameters JSONB,
  row_count INTEGER,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_code VARCHAR(255),
  error_message TEXT,

  -- Data snapshots / Snapshots de datos
  data_before JSONB,
  data_after JSONB,

  -- Actor information / Información del actor
  actor_type VARCHAR(50),
  actor_user_id VARCHAR(255),
  actor_username VARCHAR(255),
  actor_roles JSONB,
  actor_tenant_id VARCHAR(255),

  -- Request information / Información de request
  request_ip VARCHAR(45),
  request_user_agent TEXT,
  request_id VARCHAR(255),
  request_session_id VARCHAR(255),

  -- Indexes / Índices
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries / Crear índices para consultas comunes
CREATE INDEX IF NOT EXISTS idx_panoptes_timestamp ON panoptes_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_panoptes_app_name ON panoptes_audit_log(app_name);
CREATE INDEX IF NOT EXISTS idx_panoptes_main_table ON panoptes_audit_log(main_table);
CREATE INDEX IF NOT EXISTS idx_panoptes_operation_type ON panoptes_audit_log(operation_type);
CREATE INDEX IF NOT EXISTS idx_panoptes_actor_user_id ON panoptes_audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_panoptes_success ON panoptes_audit_log(success);
CREATE INDEX IF NOT EXISTS idx_panoptes_date ON panoptes_audit_log(date);
`,

	mysql: `
-- Panoptes Audit Log Table for MySQL
-- Tabla de Auditoría de Panoptes para MySQL

CREATE TABLE IF NOT EXISTS panoptes_audit_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  -- Meta information / Información meta
  app_name VARCHAR(255) NOT NULL,
  environment VARCHAR(50) NOT NULL,
  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  timestamp_unix BIGINT NOT NULL,
  \`date\` DATE NOT NULL,
  \`time\` TIME NOT NULL,
  duration_ms DECIMAL(10, 2),
  reason VARCHAR(255),

  -- Database information / Información de base de datos
  db_engine VARCHAR(50) NOT NULL,
  db_host VARCHAR(255),
  db_name VARCHAR(255),
  db_user VARCHAR(255),
  db_schema VARCHAR(255),

  -- Operation information / Información de operación
  operation_type VARCHAR(50) NOT NULL,
  operation_category VARCHAR(50),
  main_table VARCHAR(255),
  tables_involved JSON,

  -- SQL information / Información SQL
  sql_raw TEXT NOT NULL,
  sql_normalized TEXT,
  sql_parameters JSON,
  row_count INT,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_code VARCHAR(255),
  error_message TEXT,

  -- Data snapshots / Snapshots de datos
  data_before JSON,
  data_after JSON,

  -- Actor information / Información del actor
  actor_type VARCHAR(50),
  actor_user_id VARCHAR(255),
  actor_username VARCHAR(255),
  actor_roles JSON,
  actor_tenant_id VARCHAR(255),

  -- Request information / Información de request
  request_ip VARCHAR(45),
  request_user_agent TEXT,
  request_id VARCHAR(255),
  request_session_id VARCHAR(255),

  -- Timestamp / Marca de tiempo
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Indexes / Índices
  INDEX idx_panoptes_timestamp (\`timestamp\`),
  INDEX idx_panoptes_app_name (app_name),
  INDEX idx_panoptes_main_table (main_table),
  INDEX idx_panoptes_operation_type (operation_type),
  INDEX idx_panoptes_actor_user_id (actor_user_id),
  INDEX idx_panoptes_success (success),
  INDEX idx_panoptes_date (\`date\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`,

	mssql: `
-- Panoptes Audit Log Table for Microsoft SQL Server
-- Tabla de Auditoría de Panoptes para Microsoft SQL Server

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='panoptes_audit_log' AND xtype='U')
CREATE TABLE panoptes_audit_log (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,

  -- Meta information / Información meta
  app_name NVARCHAR(255) NOT NULL,
  environment NVARCHAR(50) NOT NULL,
  [timestamp] DATETIME2 NOT NULL DEFAULT GETDATE(),
  timestamp_unix BIGINT NOT NULL,
  [date] DATE NOT NULL,
  [time] TIME NOT NULL,
  duration_ms DECIMAL(10, 2),
  reason NVARCHAR(255),

  -- Database information / Información de base de datos
  db_engine NVARCHAR(50) NOT NULL,
  db_host NVARCHAR(255),
  db_name NVARCHAR(255),
  db_user NVARCHAR(255),
  db_schema NVARCHAR(255),

  -- Operation information / Información de operación
  operation_type NVARCHAR(50) NOT NULL,
  operation_category NVARCHAR(50),
  main_table NVARCHAR(255),
  tables_involved NVARCHAR(MAX),

  -- SQL information / Información SQL
  sql_raw NVARCHAR(MAX) NOT NULL,
  sql_normalized NVARCHAR(MAX),
  sql_parameters NVARCHAR(MAX),
  row_count INT,
  success BIT NOT NULL DEFAULT 1,
  error_code NVARCHAR(255),
  error_message NVARCHAR(MAX),

  -- Data snapshots / Snapshots de datos
  data_before NVARCHAR(MAX),
  data_after NVARCHAR(MAX),

  -- Actor information / Información del actor
  actor_type NVARCHAR(50),
  actor_user_id NVARCHAR(255),
  actor_username NVARCHAR(255),
  actor_roles NVARCHAR(MAX),
  actor_tenant_id NVARCHAR(255),

  -- Request information / Información de request
  request_ip NVARCHAR(45),
  request_user_agent NVARCHAR(MAX),
  request_id NVARCHAR(255),
  request_session_id NVARCHAR(255),

  -- Timestamp / Marca de tiempo
  created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Create indexes / Crear índices
CREATE INDEX idx_panoptes_timestamp ON panoptes_audit_log([timestamp]);
CREATE INDEX idx_panoptes_app_name ON panoptes_audit_log(app_name);
CREATE INDEX idx_panoptes_main_table ON panoptes_audit_log(main_table);
CREATE INDEX idx_panoptes_operation_type ON panoptes_audit_log(operation_type);
CREATE INDEX idx_panoptes_actor_user_id ON panoptes_audit_log(actor_user_id);
CREATE INDEX idx_panoptes_success ON panoptes_audit_log(success);
CREATE INDEX idx_panoptes_date ON panoptes_audit_log([date]);
`,

	sqlite: `
-- Panoptes Audit Log Table for SQLite
-- Tabla de Auditoría de Panoptes para SQLite

CREATE TABLE IF NOT EXISTS panoptes_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Meta information / Información meta
  app_name TEXT NOT NULL,
  environment TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  timestamp_unix INTEGER NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration_ms REAL,
  reason TEXT,

  -- Database information / Información de base de datos
  db_engine TEXT NOT NULL,
  db_host TEXT,
  db_name TEXT,
  db_user TEXT,
  db_schema TEXT,

  -- Operation information / Información de operación
  operation_type TEXT NOT NULL,
  operation_category TEXT,
  main_table TEXT,
  tables_involved TEXT,

  -- SQL information / Información SQL
  sql_raw TEXT NOT NULL,
  sql_normalized TEXT,
  sql_parameters TEXT,
  row_count INTEGER,
  success INTEGER NOT NULL DEFAULT 1,
  error_code TEXT,
  error_message TEXT,

  -- Data snapshots / Snapshots de datos
  data_before TEXT,
  data_after TEXT,

  -- Actor information / Información del actor
  actor_type TEXT,
  actor_user_id TEXT,
  actor_username TEXT,
  actor_roles TEXT,
  actor_tenant_id TEXT,

  -- Request information / Información de request
  request_ip TEXT,
  request_user_agent TEXT,
  request_id TEXT,
  request_session_id TEXT,

  -- Timestamp / Marca de tiempo
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes / Crear índices
CREATE INDEX IF NOT EXISTS idx_panoptes_timestamp ON panoptes_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_panoptes_app_name ON panoptes_audit_log(app_name);
CREATE INDEX IF NOT EXISTS idx_panoptes_main_table ON panoptes_audit_log(main_table);
CREATE INDEX IF NOT EXISTS idx_panoptes_operation_type ON panoptes_audit_log(operation_type);
CREATE INDEX IF NOT EXISTS idx_panoptes_actor_user_id ON panoptes_audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_panoptes_success ON panoptes_audit_log(success);
CREATE INDEX IF NOT EXISTS idx_panoptes_date ON panoptes_audit_log(date);
`,

	oracle: `
-- Panoptes Audit Log Table for Oracle
-- Tabla de Auditoría de Panoptes para Oracle

BEGIN
  EXECUTE IMMEDIATE 'CREATE SEQUENCE panoptes_audit_log_seq START WITH 1 INCREMENT BY 1';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -955 THEN
      RAISE;
    END IF;
END;
/

CREATE TABLE panoptes_audit_log (
  id NUMBER DEFAULT panoptes_audit_log_seq.NEXTVAL PRIMARY KEY,

  -- Meta information / Información meta
  app_name VARCHAR2(255) NOT NULL,
  environment VARCHAR2(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  timestamp_unix NUMBER NOT NULL,
  audit_date DATE NOT NULL,
  audit_time VARCHAR2(20) NOT NULL,
  duration_ms NUMBER(10, 2),
  reason VARCHAR2(255),

  -- Database information / Información de base de datos
  db_engine VARCHAR2(50) NOT NULL,
  db_host VARCHAR2(255),
  db_name VARCHAR2(255),
  db_user VARCHAR2(255),
  db_schema VARCHAR2(255),

  -- Operation information / Información de operación
  operation_type VARCHAR2(50) NOT NULL,
  operation_category VARCHAR2(50),
  main_table VARCHAR2(255),
  tables_involved CLOB,

  -- SQL information / Información SQL
  sql_raw CLOB NOT NULL,
  sql_normalized CLOB,
  sql_parameters CLOB,
  row_count NUMBER,
  success NUMBER(1) DEFAULT 1 NOT NULL,
  error_code VARCHAR2(255),
  error_message CLOB,

  -- Data snapshots / Snapshots de datos
  data_before CLOB,
  data_after CLOB,

  -- Actor information / Información del actor
  actor_type VARCHAR2(50),
  actor_user_id VARCHAR2(255),
  actor_username VARCHAR2(255),
  actor_roles CLOB,
  actor_tenant_id VARCHAR2(255),

  -- Request information / Información de request
  request_ip VARCHAR2(45),
  request_user_agent CLOB,
  request_id VARCHAR2(255),
  request_session_id VARCHAR2(255),

  -- Timestamp / Marca de tiempo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes / Crear índices
CREATE INDEX idx_panoptes_timestamp ON panoptes_audit_log(timestamp);
CREATE INDEX idx_panoptes_app_name ON panoptes_audit_log(app_name);
CREATE INDEX idx_panoptes_main_table ON panoptes_audit_log(main_table);
CREATE INDEX idx_panoptes_operation_type ON panoptes_audit_log(operation_type);
CREATE INDEX idx_panoptes_actor_user_id ON panoptes_audit_log(actor_user_id);
CREATE INDEX idx_panoptes_success ON panoptes_audit_log(success);
CREATE INDEX idx_panoptes_date ON panoptes_audit_log(audit_date);
`,
};

/**
 * Gets SQL schema for specified database engine.
 * Obtiene el esquema SQL para el motor de base de datos especificado.
 *
 * @param {string} engine - Database engine / Motor de base de datos
 * @returns {string} SQL schema / Esquema SQL
 */
export function getAuditTableSchema(engine) {
	const schema = TABLE_SCHEMAS[engine.toLowerCase()];
	if (!schema) {
		throw new Error(
			`Unsupported database engine: ${engine}. Supported: postgres, mysql, mssql, sqlite, oracle`,
		);
	}
	return schema;
}

/**
 * Exports table schemas for programmatic use.
 * Exporta esquemas de tabla para uso programático.
 */
export { TABLE_SCHEMAS };
