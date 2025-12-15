# 👁️ Panoptes SDK - Node.js

**Enterprise-grade SQL Audit Trails for Node.js Applications**

[![npm version](https://img.shields.io/npm/v/panoptes-sdk?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/panoptes-sdk)
[![npm downloads](https://img.shields.io/npm/dm/panoptes-sdk?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/panoptes-sdk)
[![License: MIT](https://img.shields.io/github/license/malydev/panoptes-sdk?style=flat-square&color=green)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](https://nodejs.org)

> Automatically audit all SQL queries with rich context, before/after snapshots, and zero configuration. A modern alternative to database triggers.

**📚 [Complete Documentation →](https://panoptes-sdk.pages.dev/)**

---

## 🚀 Quick Start

### Installation

```bash
npm install panoptes-sdk
# or
yarn add panoptes-sdk
# or
pnpm add panoptes-sdk
```

### Basic Usage (PostgreSQL)

```javascript
import { initAudit, createAuditedPostgresClient } from 'panoptes-sdk';
import { Pool } from 'pg';

// 1. Initialize audit configuration (do this once at app startup)
initAudit({
  appName: 'my-app',
  environment: 'production',
  transports: {
    enabled: ['console', 'database']
  }
});

// 2. Create your database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 3. Wrap your client with Panoptes audit
const auditedClient = createAuditedPostgresClient(pool, {
  database: 'mydb',
  engine: 'postgres'
});

// 4. Use it like a normal client - audits are automatic!
await auditedClient.query('UPDATE users SET email = $1 WHERE id = $2',
  ['new@email.com', 123]
);
// ✅ This query is now automatically logged with full context
```

---

## ✨ What You Get

Panoptes SDK automatically tracks every database change in your application:

- ✅ **Automatic Audit Logging** - All INSERT, UPDATE, DELETE operations logged automatically
- 👤 **User Context** - Know WHO made each change (user ID, username, IP, session)
- 📸 **Before/After Snapshots** - See exact data changes for compliance and debugging
- 🗄️ **Universal Database Support** - Works with PostgreSQL, MySQL, MSSQL, SQLite, Oracle
- ⚡ **Zero Setup** - Just wrap your database client - audit table created automatically
- 🚀 **Production Ready** - Async processing for minimal performance impact (<5ms overhead)
- 📤 **Flexible Output** - Send logs to console, files, databases, or HTTP endpoints
- 🔒 **Compliance Ready** - Perfect for GDPR, SOC 2, HIPAA audit requirements

---

## 🎯 Why Use Panoptes?

**Instead of this (database triggers):**
```sql
-- Complex trigger logic that's hard to maintain
CREATE TRIGGER audit_users_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  -- Manual JSON building, no user context, database-specific...
END;
```

**Just do this:**
```javascript
const db = createAuditedPostgresClient(pool, { database: 'mydb', engine: 'postgres' });
// That's it! All queries are now automatically audited with full context
```

---

## 📖 Documentation

This is the **Node.js implementation** of Panoptes SDK.

### 📚 Full Documentation
Visit **[https://panoptes-sdk.pages.dev/](https://panoptes-sdk.pages.dev/)** for complete guides:

- **[Getting Started](https://panoptes-sdk.pages.dev//docs/getting-started)** - Complete walkthrough
- **[Installation Guide](https://panoptes-sdk.pages.dev//docs/guides/installations)** - Database-specific setup
- **[Configuration](https://panoptes-sdk.pages.dev//docs/guides/configuration)** - All options explained
- **[Integrations](https://panoptes-sdk.pages.dev//docs/integrations)** - Transports & external systems
- **[Comparison](https://panoptes-sdk.pages.dev//docs/comparison)** - vs Triggers, CDC, etc.

---

## 🗄️ Database Setup Examples

Panoptes SDK works with all major SQL databases. Here's how to use it with each:

### PostgreSQL

```javascript
import { initAudit, createAuditedPostgresClient } from 'panoptes-sdk';
import { Pool } from 'pg';

initAudit({ appName: 'my-app', environment: 'production' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = createAuditedPostgresClient(pool, {
  database: 'mydb',
  engine: 'postgres'
});

await client.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['John', 'john@example.com']);
```

### MySQL

```javascript
import { initAudit, createAuditedMySQLClient } from 'panoptes-sdk';
import mysql from 'mysql2/promise';

initAudit({ appName: 'my-app', environment: 'production' });

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'mydb'
});

const client = createAuditedMySQLClient(pool, {
  database: 'mydb',
  engine: 'mysql'
});

await client.query('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com']);
```

### MSSQL (SQL Server)

```javascript
import { initAudit, createAuditedMSSQLClient } from 'panoptes-sdk';
import sql from 'mssql';

initAudit({ appName: 'my-app', environment: 'production' });

const pool = new sql.ConnectionPool({
  server: 'localhost',
  database: 'mydb',
  user: 'sa',
  password: 'password'
});
await pool.connect();

const client = createAuditedMSSQLClient(pool, {
  database: 'mydb',
  engine: 'mssql'
});

await client.query('INSERT INTO users (name, email) VALUES (@name, @email)', {
  name: 'John',
  email: 'john@example.com'
});
```

### SQLite

```javascript
import { initAudit, createAuditedSQLiteClient } from 'panoptes-sdk';
import sqlite3 from 'sqlite3';

initAudit({ appName: 'my-app', environment: 'development' });

const db = new sqlite3.Database('./mydb.sqlite');

const client = createAuditedSQLiteClient(db, {
  database: 'mydb',
  engine: 'sqlite'
});

await client.query('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com']);
```

### Oracle

```javascript
import { initAudit, createAuditedOracleClient } from 'panoptes-sdk';
import oracledb from 'oracledb';

initAudit({ appName: 'my-app', environment: 'production' });

const pool = await oracledb.createPool({
  user: 'system',
  password: 'password',
  connectString: 'localhost/XEPDB1'
});

const client = createAuditedOracleClient(pool, {
  database: 'mydb',
  engine: 'oracle'
});

await client.query('INSERT INTO users (name, email) VALUES (:name, :email)', {
  name: 'John',
  email: 'john@example.com'
});
```

---

## 💡 Framework Integration Examples

### Express.js + PostgreSQL

```javascript
import express from 'express';
import { initAudit, createAuditedPostgresClient, setUserContext } from 'panoptes-sdk';
import { Pool } from 'pg';

const app = express();

// Initialize Panoptes at app startup
initAudit({
  appName: 'my-express-app',
  environment: process.env.NODE_ENV,
  transports: {
    enabled: ['console', 'database']
  }
});

// Create audited database client
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = createAuditedPostgresClient(pool, {
  database: 'mydb',
  engine: 'postgres'
});

// Middleware to set user context for ALL requests
app.use((req, res, next) => {
  setUserContext({
    userId: req.user?.id,
    username: req.user?.email,
    ipAddress: req.ip,
    sessionId: req.sessionID,
    userAgent: req.get('user-agent')
  });
  next();
});

// Your routes now automatically log all database changes
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  // This query is automatically audited with user context!
  const result = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );

  res.json(result.rows[0]);
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  // Update is audited with before/after snapshots
  await db.query(
    'UPDATE users SET email = $1 WHERE id = $2',
    [email, id]
  );

  res.json({ success: true });
});

app.listen(3000);
```

### Fastify + MySQL

```javascript
import Fastify from 'fastify';
import { initAudit, createAuditedMySQLClient, setUserContext } from 'panoptes-sdk';
import mysql from 'mysql2/promise';

const fastify = Fastify();

initAudit({
  appName: 'my-fastify-app',
  environment: 'production'
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const db = createAuditedMySQLClient(pool, {
  database: 'mydb',
  engine: 'mysql'
});

// Hook to set user context
fastify.addHook('onRequest', async (request, reply) => {
  setUserContext({
    userId: request.user?.id,
    username: request.user?.username,
    ipAddress: request.ip
  });
});

fastify.post('/products', async (request, reply) => {
  const { name, price } = request.body;

  const [result] = await db.query(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price]
  );

  return { id: result.insertId, name, price };
});

await fastify.listen({ port: 3000 });
```

### NestJS + PostgreSQL

```typescript
// database.module.ts
import { Module } from '@nestjs/common';
import { initAudit, createAuditedPostgresClient } from 'panoptes-sdk';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'DATABASE_CLIENT',
      useFactory: () => {
        initAudit({
          appName: 'my-nestjs-app',
          environment: process.env.NODE_ENV
        });

        const pool = new Pool({
          connectionString: process.env.DATABASE_URL
        });

        return createAuditedPostgresClient(pool, {
          database: 'mydb',
          engine: 'postgres'
        });
      }
    }
  ],
  exports: ['DATABASE_CLIENT']
})
export class DatabaseModule {}

// user.service.ts
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_CLIENT') private db: any) {}

  async createUser(name: string, email: string) {
    const result = await this.db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  }

  async updateUser(id: number, email: string) {
    await this.db.query(
      'UPDATE users SET email = $1 WHERE id = $2',
      [email, id]
    );
  }
}
```

---

## ⚙️ Configuration Examples

### Basic Configuration

```javascript
import { initAudit } from 'panoptes-sdk';

initAudit({
  appName: 'my-app',
  environment: 'production'
});
```

### Environment-Based Configuration

```javascript
initAudit({
  appName: 'my-app',
  environment: process.env.NODE_ENV,

  // Use different transports based on environment
  transports: {
    enabled: process.env.NODE_ENV === 'production'
      ? ['database', 'http']  // Production: save to DB and send to external service
      : ['console']            // Development: just log to console
  },

  // Enable async mode in production for better performance
  asyncMode: process.env.NODE_ENV === 'production',
  bufferSize: 500
});
```

### Audit Only Specific Tables

```javascript
initAudit({
  appName: 'my-app',

  // Only audit these tables
  rules: {
    includeTables: ['users', 'transactions', 'orders', 'payments'],
    operations: ['INSERT', 'UPDATE', 'DELETE']  // Don't audit SELECT
  }
});
```

### Exclude Sensitive Tables

```javascript
initAudit({
  appName: 'my-app',

  rules: {
    excludeTables: ['sessions', 'cache', 'temp_data'],  // Skip these tables
    operations: ['INSERT', 'UPDATE', 'DELETE']
  }
});
```

### Multiple Transport Destinations

```javascript
initAudit({
  appName: 'my-app',

  transports: {
    enabled: ['console', 'database', 'file', 'http'],

    // File transport configuration
    file: {
      path: './logs/audit.log',
      maxSize: '100MB',
      maxFiles: 10
    },

    // HTTP transport (send to external service)
    http: {
      url: 'https://your-logging-service.com/api/logs',
      headers: {
        'Authorization': `Bearer ${process.env.LOGGING_API_KEY}`
      }
    }
  }
});
```

### Custom Metadata in Context

```javascript
import { setUserContext } from 'panoptes-sdk';

// Set context with custom fields
setUserContext({
  userId: user.id,
  username: user.email,
  ipAddress: req.ip,

  // Add custom metadata
  metadata: {
    organizationId: user.organizationId,
    department: user.department,
    role: user.role,
    requestId: req.headers['x-request-id']
  }
});
```

### Async Mode for High Performance

```javascript
initAudit({
  appName: 'my-app',

  // Process audits asynchronously (recommended for production)
  asyncMode: true,
  bufferSize: 1000,  // Buffer up to 1000 audit logs before flushing

  // Flush interval (in milliseconds)
  flushInterval: 5000  // Flush every 5 seconds
});
```

---

## 📊 Reading Audit Logs

Once you start using Panoptes, all audits are stored in the `audit_logs` table. Here's how to query them:

### View Recent Audits

```sql
SELECT
  operation,
  table_name,
  user_id,
  username,
  ip_address,
  created_at,
  query
FROM audit_logs
ORDER BY created_at DESC
LIMIT 50;
```

### Find All Changes by a User

```sql
SELECT *
FROM audit_logs
WHERE user_id = 123
ORDER BY created_at DESC;
```

### Track Changes to Specific Record

```sql
SELECT
  operation,
  before_state,
  after_state,
  username,
  created_at
FROM audit_logs
WHERE table_name = 'users'
  AND query LIKE '%WHERE id = 123%'
ORDER BY created_at DESC;
```

### Audit Trail for Compliance

```sql
-- Find all deletions in the last 30 days
SELECT
  table_name,
  before_state,
  username,
  ip_address,
  created_at
FROM audit_logs
WHERE operation = 'DELETE'
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

**➡️ [More Examples in Documentation](https://panoptes-sdk.pages.dev//docs/getting-started)**

---

## 🔍 API Reference

### Main Functions

#### `initAudit(config)`

Initializes Panoptes audit system. Call this **once** at application startup.

```javascript
initAudit({
  appName: 'my-app',              // Required: Your application name
  environment: 'production',       // Required: Environment (dev, staging, prod, etc.)

  // Optional configurations
  asyncMode: true,                 // Process audits asynchronously
  bufferSize: 1000,               // Buffer size for async mode
  flushInterval: 5000,            // Flush interval in ms

  rules: {
    includeTables: ['users'],     // Only audit these tables
    excludeTables: ['cache'],     // Skip these tables
    operations: ['INSERT', 'UPDATE', 'DELETE']  // Which operations to audit
  },

  transports: {
    enabled: ['console', 'database', 'file', 'http'],
    file: { path: './logs/audit.log' },
    http: { url: 'https://api.example.com/logs' }
  }
});
```

#### `createAuditedPostgresClient(pool, config)`

Creates an audited PostgreSQL client.

```javascript
const client = createAuditedPostgresClient(pool, {
  database: 'mydb',
  engine: 'postgres'
});
```

#### `createAuditedMySQLClient(pool, config)`

Creates an audited MySQL client.

```javascript
const client = createAuditedMySQLClient(pool, {
  database: 'mydb',
  engine: 'mysql'
});
```

#### `createAuditedMSSQLClient(pool, config)`

Creates an audited MSSQL client.

```javascript
const client = createAuditedMSSQLClient(pool, {
  database: 'mydb',
  engine: 'mssql'
});
```

#### `createAuditedSQLiteClient(db, config)`

Creates an audited SQLite client.

```javascript
const client = createAuditedSQLiteClient(db, {
  database: 'mydb',
  engine: 'sqlite'
});
```

#### `createAuditedOracleClient(pool, config)`

Creates an audited Oracle client.

```javascript
const client = createAuditedOracleClient(pool, {
  database: 'mydb',
  engine: 'oracle'
});
```

#### `setUserContext(context)`

Sets user context for the current request/operation. Call this in your middleware.

```javascript
setUserContext({
  userId: 123,                    // User ID
  username: 'john@example.com',   // Username or email
  ipAddress: '192.168.1.1',       // IP address
  sessionId: 'abc123',            // Session ID
  userAgent: 'Mozilla/5.0...',    // User agent

  // Custom metadata
  metadata: {
    organizationId: 456,
    role: 'admin'
  }
});
```

---

## 📦 Package Information

- **Version**: `0.2.0`
- **License**: MIT
- **Node.js**: `>=18`
- **Module Types**: ESM + CommonJS
- **TypeScript**: Full type definitions included
- **Size**: ~50KB (minified)

---

## ❓ FAQ

### Do I need to create the audit table manually?

No! Panoptes automatically creates the `audit_logs` table on first run.

### Will this slow down my queries?

In async mode (recommended for production), auditing happens in the background with minimal performance impact. Typical overhead is <5ms per query.

### Can I use this with ORMs like Prisma or TypeORM?

Yes, but you'll need to wrap the underlying database connection. See the [Integrations guide](https://panoptes-sdk.pages.dev/docs/integrations) for examples.

### How do I handle migrations?

The audit table is created automatically. For schema changes, see the [Migration guide](https://panoptes-sdk.pages.dev/docs/guides/migrations).

### Can I customize the audit table name?

Yes, you can configure this in `initAudit()`:

```javascript
initAudit({
  appName: 'my-app',
  tableName: 'my_custom_audit_table'
});
```

---

## 📄 License

[MIT License](https://github.com/malydev/panoptes-sdk/blob/main/node/LICENSE) - Free for personal and commercial use.

---

## 🔗 Useful Links

- 📚 **[Complete Documentation](https://panoptes-sdk.pages.dev/)** - Full guides and tutorials
- 📦 **[NPM Package](https://www.npmjs.com/package/panoptes-sdk)** - Package page
- 🐛 **[Report Issues](https://github.com/malydev/panoptes-sdk/issues)** - Bug reports and feature requests
- 💬 **[GitHub Discussions](https://github.com/malydev/panoptes-sdk/discussions)** - Ask questions and share ideas
- 📋 **[Changelog](https://github.com/malydev/panoptes-sdk/releases)** - Release notes

---

## 🆘 Support

Need help? Here's how to get support:

1. **Check the [Documentation](https://panoptes-sdk.pages.dev/)** - Most common questions are answered there
2. **Search [GitHub Issues](https://github.com/malydev/panoptes-sdk/issues)** - Someone may have already solved your problem
3. **Ask in [Discussions](https://github.com/malydev/panoptes-sdk/discussions)** - Community support
4. **Open an Issue** - For bugs or feature requests

---

<div align="center">

**Made by [malydev](https://github.com/malydev)**

If Panoptes SDK helps your project, consider giving it a ⭐ on GitHub!

**[📚 Read Full Documentation](https://panoptes-sdk.pages.dev/)** • **[🐛 Report Bug](https://github.com/malydev/panoptes-sdk/issues)** • **[💡 Request Feature](https://github.com/malydev/panoptes-sdk/issues/new)**

</div>
