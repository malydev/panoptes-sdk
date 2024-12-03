---
title: Quick Start
description: Get up and running with Panoptes SDK in 5 minutes
---

# Quick Start Guide

Get Panoptes SDK working in your application in just 5 minutes.

## Step 1: Install

```bash
npm install @panoptes/sdk
```

## Step 2: Initialize Panoptes

Add this near the top of your application entry point (e.g., `index.js`, `app.js`):

```javascript
import { initAudit } from '@panoptes/sdk';

initAudit({
  appName: 'my-app',
  environment: 'dev',  // 'dev', 'stage', or 'prod'
  transports: {
    enabled: ['console']  // Start simple with console output
  }
});
```

## Step 3: Wrap Your Database Client

### PostgreSQL

```javascript
import { Client } from 'pg';
import { createAuditedPostgresClient } from '@panoptes/sdk';

const client = new Client({
  host: 'localhost',
  database: 'mydb',
  user: 'postgres',
  password: 'password'
});

// Wrap it with Panoptes
const auditedClient = createAuditedPostgresClient(client, {
  host: 'localhost',
  database: 'mydb'
});

await auditedClient.connect();
```

### MySQL

```javascript
import mysql from 'mysql2/promise';
import { createAuditedMySQLClient } from '@panoptes/sdk';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});

const auditedClient = createAuditedMySQLClient(connection, {
  host: 'localhost',
  database: 'test'
});
```

### Other Databases

See the [Database Guides](/databases/postgresql/) for MSSQL, SQLite, and Oracle.

## Step 4: Set User Context (Optional but Recommended)

In your Express middleware or request handler:

```javascript
import { setUserContext } from '@panoptes/sdk';

app.use((req, res, next) => {
  setUserContext({
    actorType: 'USER',
    appUserId: req.user?.id,
    appUsername: req.user?.username,
    appRoles: req.user?.roles,
    ipAddress: req.ip
  });
  next();
});
```

## Step 5: Query as Normal

That's it! All queries are now automatically audited:

```javascript
// All these queries will be audited
const users = await auditedClient.query('SELECT * FROM users');
await auditedClient.query('INSERT INTO users (name) VALUES ($1)', ['John']);
await auditedClient.query('UPDATE users SET email = $1 WHERE id = $2', ['new@example.com', 123]);
```

## See the Audit Output

When you run a query, you'll see audit events in your console:

```json
[Panoptes][audit-event] {
  "meta": {
    "appName": "my-app",
    "environment": "dev",
    "timestamp": "2024-12-04T10:30:00.000Z",
    "durationMs": 5.2
  },
  "db": {
    "engine": "postgres",
    "host": "localhost",
    "name": "mydb"
  },
  "operation": {
    "type": "SELECT",
    "category": "DML",
    "mainTable": "users"
  },
  "sql": {
    "raw": "SELECT * FROM users",
    "success": true,
    "rowCount": 42
  },
  "actor": {
    "actorType": "USER",
    "appUserId": 123,
    "appUsername": "john.doe"
  }
}
```

## Complete Example

Here's a full working example with Express:

```javascript
import express from 'express';
import { Client } from 'pg';
import {
  initAudit,
  createAuditedPostgresClient,
  setUserContext
} from '@panoptes/sdk';

// 1. Initialize Panoptes
initAudit({
  appName: 'my-express-app',
  environment: 'dev',
  transports: {
    enabled: ['console']
  }
});

// 2. Create audited database client
const client = new Client({
  host: 'localhost',
  database: 'mydb',
  user: 'postgres',
  password: 'password'
});

const auditedClient = createAuditedPostgresClient(client, {
  host: 'localhost',
  database: 'mydb'
});

await auditedClient.connect();

// 3. Create Express app
const app = express();

// 4. Set user context middleware
app.use((req, res, next) => {
  setUserContext({
    actorType: 'USER',
    appUserId: req.user?.id || 'anonymous',
    appUsername: req.user?.username,
    ipAddress: req.ip
  });
  next();
});

// 5. Use audited client in routes
app.get('/users', async (req, res) => {
  const result = await auditedClient.query('SELECT * FROM users');
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Next Steps

### Configure Advanced Features

- [Auto-create audit tables](/advanced/auto-create-tables/) - Automatically create audit storage
- [Database transport](/transports/database/) - Store audit logs in a separate database
- [Table rules](/concepts/rules-engine/) - Configure which tables to audit
- [Before/after capture](/advanced/before-after-capture/) - Track data changes

### Explore Examples

- [Express Application](/examples/express/) - Full Express.js integration
- [Multi-tenancy](/examples/multi-tenancy/) - Multi-tenant setup
- [Background Jobs](/examples/background-jobs/) - Auditing background tasks

### Learn Core Concepts

- [How It Works](/concepts/how-it-works/) - Understand the architecture
- [Audit Flow](/concepts/audit-flow/) - See how queries are processed
- [User Context](/concepts/user-context/) - Deep dive into context management

---

**Questions?** Check out the [full documentation](/) or [open an issue](https://github.com/malydev/panoptes-sdk/issues).
