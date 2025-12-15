# 🔍 Panoptes SDK

**Enterprise-grade SQL auditing for modern applications**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![npm version](https://img.shields.io/npm/v/@panoptes/sdk.svg)](https://www.npmjs.com/package/panoptes-sdk)

> Automatically audit all SQL queries with rich context, flexible rules, and zero configuration. A modern alternative to database triggers.

---

## 🚀 Quick Start

```bash
npm install panoptes/sdk
```

```javascript
import { initAudit, createAuditedPostgresClient } from 'panoptes/sdk';

initAudit({
  appName: 'my-app',
  transports: { enabled: ['console'] }
});

const auditedClient = createAuditedPostgresClient(client, dbInfo);
```

**📚 [Full Documentation](./docs)** | **🎯 [Live Examples](./docs/examples)**

---

## ✨ Features

- ⚡ **Zero Configuration** - Auto-creates audit tables, no manual setup
- 🗄️ **Multi-Database Support** - PostgreSQL, MySQL, MSSQL, SQLite, Oracle
- 👤 **Rich User Context** - Tracks who, what, when, where for every query
- 🎯 **Flexible Rules** - Configure auditing per table or operation type
- 📊 **Multiple Transports** - Console, File, HTTP, Database
- 🔍 **Before/After Capture** - Track data changes for compliance
- ⚙️ **Production Ready** - Battle-tested, optimized, and secure

---

## 🗂️ Project Structure

```
panoptes-sdk/
├── node/          # Node.js SDK
├── python/        # Python SDK (coming soon)
├── docs/          # Comprehensive documentation (Astro)
└── README.md      # This file
```

---

## 💡 Why Panoptes?

**Better than Database Triggers:**
- ✅ Portable across databases
- ✅ Rich application context (user, IP, roles, request ID)
- ✅ Multiple output destinations (not just same DB)
- ✅ Versionable, testable, debuggable
- ✅ Zero database overhead

**Perfect for:**
- 🏥 Healthcare (HIPAA compliance)
- 💰 Finance (SOX compliance)
- 🛒 E-commerce (PCI-DSS)
- 🔐 Security & Compliance
- 📊 Data governance

---

## 🧑‍💻 Supported Platforms

### Node.js SDK (Ready)
- ✅ PostgreSQL
- ✅ MySQL
- ✅ Microsoft SQL Server
- ✅ SQLite
- ✅ Oracle

### Python SDK (Coming Soon)
- 🔄 In development

---

## 📖 Documentation

Visit the [documentation site](./docs) for:
- 📚 Complete API reference
- 🎯 Step-by-step guides
- 💡 Real-world examples
- 🔧 Advanced configuration
- 📊 Best practices

---

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](./docs/src/content/docs/contributing.md) for details.

---

## 📄 License

[MIT License](./LICENSE) - feel free to use in commercial projects.

---

## 👤 Author

**Created by [malydev](https://github.com/malydev) (Miguel Lipa)**

If you find this project useful, consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting features
- 🤝 Contributing code

---

## 🔗 Links

- 📦 [npm Package](https://www.npmjs.com/package/panoptes-sdk)
- 📚 [Documentation](./docs)
- 🐛 [Issue Tracker](https://github.com/malydev/panoptes-sdk/issues)
- 💬 [Discussions](https://github.com/malydev/panoptes-sdk/discussions)

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/malydev">Miguel Lipa</a></sub>
</p>
