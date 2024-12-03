---
title: Introduction
description: Learn what Panoptes SDK is and why you should use it
---

# Introduction to Panoptes SDK

Panoptes SDK is an **enterprise-grade SQL auditing solution** for Node.js applications that automatically tracks and logs all database queries with rich contextual information.

## What is Panoptes?

Panoptes SDK intercepts database queries at the application level and captures comprehensive audit information including:

- **Who** - User ID, username, roles, tenant ID
- **What** - SQL query, operation type, affected tables
- **When** - Timestamp, duration, date/time breakdowns
- **Where** - IP address, user agent, request/session IDs
- **Result** - Row count, success/failure, errors

## Why Panoptes?

Traditional database triggers have significant limitations. Panoptes SDK solves these problems:

| Challenge | Database Triggers | Panoptes SDK |
|-----------|------------------|--------------|
| **Portability** | Different syntax per database | One codebase, all databases |
| **Context** | Only database user | Full application context |
| **Flexibility** | Same database only | Multiple destinations |
| **Maintenance** | Hard to version/test | Git-tracked, testable |
| **Performance** | Blocks transactions | Asynchronous, non-blocking |
| **Debugging** | Very difficult | Clear logs, easy to trace |

## Key Benefits

### 🚀 Zero Configuration

```javascript
initAudit({
  appName: 'my-app',
  transports: {
    enabled: ['database'],
    database: {
      client: auditDbClient,
      engine: 'postgres',
      autoCreateTable: true  // ⭐ That's it!
    }
  }
});
```

No manual table creation, no SQL scripts, no complex setup.

### 🗄️ Multi-Database Support

Write once, audit anywhere:

- PostgreSQL
- MySQL
- Microsoft SQL Server
- SQLite
- Oracle

### 👤 Rich User Context

Unlike triggers that only see the database user, Panoptes captures the real application user:

```javascript
setUserContext({
  actorType: 'USER',
  appUserId: 123,
  appUsername: 'john.doe',
  appRoles: ['admin'],
  tenantId: 'acme-corp',
  ipAddress: '192.168.1.1',
  requestId: 'req-abc-123'
});
```

### 📊 Multiple Transports

Send audit events to multiple destinations:

- **Console** - Development and debugging
- **File** - Local log files
- **HTTP** - External SIEM/logging services
- **Database** - Centralized audit database

### 🎯 Flexible Rules

Control what gets audited:

```javascript
setTableRules({
  users: {
    enabled: true,
    auditedOperations: ['INSERT', 'UPDATE', 'DELETE'],
    sensitivityLevel: 'HIGH'
  },
  logs: {
    enabled: false  // Don't audit logs table
  }
});
```

## Use Cases

### Healthcare (HIPAA Compliance)

Track all access to patient records with complete audit trails:

```javascript
// Know exactly who accessed what patient data
{
  actor: { appUserId: 'dr-smith', appRoles: ['doctor'] },
  operation: { mainTable: 'patients' },
  sql: { raw: 'SELECT * FROM patients WHERE id = $1' },
  request: { ipAddress: '10.0.1.5', sessionId: 'sess-123' }
}
```

### Finance (SOX Compliance)

Audit all financial transactions and data modifications:

```javascript
// Complete audit trail for regulatory compliance
{
  operation: { mainTable: 'transactions' },
  sql: { raw: 'UPDATE accounts SET balance = ...' },
  data: { before: {...}, after: {...} }  // Before/after data
}
```

### E-commerce (PCI-DSS)

Monitor all payment and customer data access:

```javascript
// Track access to sensitive payment information
{
  operation: { mainTable: 'payment_methods', sensitivityLevel: 'HIGH' },
  actor: { appUsername: 'checkout-service' },
  request: { ipAddress: '203.0.113.5' }
}
```

## How It Works

1. **Wrap** your database client with Panoptes
2. **Initialize** audit configuration
3. **Set** user context (usually in middleware)
4. **Query** normally - all queries are automatically audited

```javascript
// 1. Wrap
const auditedClient = createAuditedPostgresClient(client, dbInfo);

// 2. Initialize
initAudit({ appName: 'my-app', ... });

// 3. Set context (in middleware)
app.use((req, res, next) => {
  setUserContext({ appUserId: req.user?.id, ... });
  next();
});

// 4. Query normally
await auditedClient.query('SELECT * FROM users');  // ✅ Automatically audited
```

## Next Steps

Ready to get started?

- [Installation](/getting-started/installation/) - Install Panoptes SDK
- [Quick Start](/getting-started/quick-start/) - 5-minute setup guide
- [Configuration](/getting-started/configuration/) - Detailed configuration options

---

**Created by [malydev](https://github.com/malydev) (Miguel Lipa)**
