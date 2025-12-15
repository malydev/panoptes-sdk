# 👁️ Panoptes SDK - Node.js

**Enterprise-grade SQL Audit Trails for Node.js Applications**

[![npm version](https://img.shields.io/npm/v/panoptes-sdk?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/panoptes-sdk)
[![npm downloads](https://img.shields.io/npm/dm/panoptes-sdk?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/panoptes-sdk)
[![License: MIT](https://img.shields.io/github/license/malydev/panoptes-sdk?style=flat-square&color=green)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square)](https://nodejs.org)

> Automatically audit all SQL queries with rich context, before/after snapshots, and zero configuration. A modern alternative to database triggers.

**📚 [Complete Documentation →](https://your-docs-url.com)**

---

## 🚀 Quick Start

### Installation

```bash
npm install panoptes-sdk
```

### Basic Usage

```javascript
import { initAudit, createAuditedPostgresClient } from 'panoptes-sdk';
import { Pool } from 'pg';

// Initialize audit system
initAudit({
  appName: 'my-app',
  environment: 'production',
  transports: {
    enabled: ['console', 'database']
  }
});

// Create audited client
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const auditedClient = createAuditedPostgresClient(pool, {
  database: 'mydb',
  engine: 'postgres'
});

// Use it - audits happen automatically!
await auditedClient.query('UPDATE users SET email = $1 WHERE id = $2',
  ['new@email.com', 123]
);
```

---

## ✨ Key Features

- ⚡ **Zero Configuration** - Auto-creates audit tables, works out of the box
- 🗄️ **Multi-Database** - PostgreSQL, MySQL, MSSQL, SQLite, Oracle
- 👤 **Rich Context** - User, IP, session, custom metadata
- 📊 **Before/After States** - Track data changes for compliance
- 🚀 **Multiple Transports** - Console, File, HTTP, Database
- ⚙️ **Production Ready** - Async processing, optimized, battle-tested

---

## 📖 Documentation

This is the **Node.js implementation** of Panoptes SDK.

### 📚 Full Documentation
Visit **[https://your-docs-url.com](https://your-docs-url.com)** for complete guides:

- **[Getting Started](https://your-docs-url.com/docs/getting-started)** - Complete walkthrough
- **[Installation Guide](https://your-docs-url.com/docs/guides/installations)** - Database-specific setup
- **[Configuration](https://your-docs-url.com/docs/guides/configuration)** - All options explained
- **[Integrations](https://your-docs-url.com/docs/integrations)** - Transports & external systems
- **[Comparison](https://your-docs-url.com/docs/comparison)** - vs Triggers, CDC, etc.

---

## 🗄️ Supported Databases

| Database | Status | Driver |
|----------|--------|--------|
| PostgreSQL | ✅ Ready | `pg` |
| MySQL | ✅ Ready | `mysql2` |
| MSSQL | ✅ Ready | `mssql` |
| SQLite | ✅ Ready | `sqlite3` |
| Oracle | ✅ Ready | `oracledb` |

---

## 💡 Common Use Cases

### Setting User Context (Express.js)

```javascript
import { setUserContext } from 'panoptes-sdk';

app.use((req, res, next) => {
  setUserContext({
    userId: req.user?.id,
    username: req.user?.email,
    ipAddress: req.ip,
    sessionId: req.sessionID
  });
  next();
});
```

### Environment-Based Config

```javascript
initAudit({
  appName: 'my-app',
  environment: process.env.NODE_ENV,
  transports: {
    enabled: process.env.NODE_ENV === 'production'
      ? ['database', 'http']
      : ['console']
  },
  asyncMode: process.env.NODE_ENV === 'production',
  bufferSize: 500
});
```

### Audit Rules

```javascript
initAudit({
  appName: 'my-app',
  rules: {
    includeTables: ['users', 'transactions', 'orders'],
    operations: ['INSERT', 'UPDATE', 'DELETE']
  }
});
```

**➡️ [More Examples in Documentation](https://your-docs-url.com/docs/getting-started)**

---

## 🏗️ Project Structure

```
node/
├── src/              # Source code
│   ├── core/        # Core auditing logic
│   ├── clients/     # Database client wrappers
│   ├── transports/  # Output transports
│   └── index.js     # Main exports
├── dist/            # Compiled output
│   ├── esm/        # ES Modules
│   ├── cjs/        # CommonJS
│   └── types/      # TypeScript definitions
├── examples/        # Usage examples
├── package.json
└── README.md       # This file
```

---

## 📦 Package Info

- **Version**: `0.2.0`
- **License**: MIT
- **Node.js**: `>=18`
- **Type**: Dual package (ESM + CJS)
- **TypeScript**: Type definitions included

---

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format

# Test
pnpm test
```

---

## 🤝 Contributing

Contributions welcome! Please see the [Contributing Guide](../CONTRIBUTING.md) in the root repository.

---

## 📄 License

[MIT License](../LICENSE) - Free for personal and commercial use.

---

## 🔗 Links

- 📦 **[NPM Package](https://www.npmjs.com/package/panoptes-sdk)**
- 📚 **[Complete Documentation](https://your-docs-url.com)**
- 🐛 **[Report Issues](https://github.com/malydev/panoptes-sdk/issues)**
- 💬 **[Discussions](https://github.com/malydev/panoptes-sdk/discussions)**
- 📋 **[Changelog](https://github.com/malydev/panoptes-sdk/releases)**

---

## 👤 Author

**Miguel Lipa** ([@malydev](https://github.com/malydev))

If this helps you:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute

---

<div align="center">

**Made with ❤️ by [malydev](https://github.com/malydev)**

**[📚 View Full Documentation →](https://your-docs-url.com)**

</div>
