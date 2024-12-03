---
title: Installation
description: How to install Panoptes SDK in your Node.js project
---

# Installation

Get Panoptes SDK up and running in your Node.js project in under 2 minutes.

## Requirements

- **Node.js** >= 18
- One of the supported databases:
  - PostgreSQL
  - MySQL
  - Microsoft SQL Server
  - SQLite
  - Oracle

## Install with npm

```bash
npm install @panoptes/sdk
```

## Install with pnpm

```bash
pnpm add @panoptes/sdk
```

## Install with yarn

```bash
yarn add @panoptes/sdk
```

## Database Drivers

Panoptes SDK works with existing database drivers. Install the appropriate driver for your database:

### PostgreSQL

```bash
npm install pg
```

### MySQL

```bash
npm install mysql2
```

### Microsoft SQL Server

```bash
npm install mssql
```

### SQLite

```bash
npm install better-sqlite3
```

### Oracle

```bash
npm install oracledb
```

## Verify Installation

Create a simple test file to verify the installation:

```javascript
// test-panoptes.js
import { initAudit } from '@panoptes/sdk';

console.log('✅ Panoptes SDK imported successfully');

initAudit({
  appName: 'test-app',
  environment: 'dev',
  transports: {
    enabled: ['console']
  }
});

console.log('✅ Panoptes SDK initialized successfully');
```

Run it:

```bash
node test-panoptes.js
```

You should see:

```
✅ Panoptes SDK imported successfully
✅ Panoptes SDK initialized successfully
```

## TypeScript Support

Panoptes SDK includes TypeScript type definitions out of the box.

No additional `@types` packages needed!

```typescript
import { initAudit, type PanoptesConfig } from '@panoptes/sdk';

const config: PanoptesConfig = {
  appName: 'my-app',
  environment: 'prod',
  transports: {
    enabled: ['console']
  }
};

initAudit(config);
```

## Next Steps

Now that you have Panoptes installed, let's get it configured:

- [Quick Start](/getting-started/quick-start/) - Set up your first audited query
- [Configuration](/getting-started/configuration/) - Learn all configuration options
- [Database Guides](/databases/postgresql/) - Database-specific setup guides

---

**Need help?** [Open an issue](https://github.com/malydev/panoptes-sdk/issues) on GitHub.
