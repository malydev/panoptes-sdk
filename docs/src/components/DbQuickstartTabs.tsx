import { useState } from "react";
import { CodeBlock } from "./ui/code-block";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type DbOption = {
  key: string;
  label: string;
  emoji: string;
  driverCmd: string;
  snippet: string;
};

const dbOptions: DbOption[] = [
  {
    key: "postgres",
    label: "PostgreSQL",
    emoji: "🐘",
    driverCmd: "npm install pg",
    snippet: `import { initAudit, createAuditedPostgresClient, setUserContext } from '@panoptes/sdk';
import { Client } from 'pg';

initAudit({ appName: 'my-app', transports: { enabled: ['console', 'database'] } });

const client = new Client({ host: 'localhost', database: 'myapp', user: 'postgres', password: process.env.DB_PASSWORD });
const db = createAuditedPostgresClient(client, { host: 'localhost', database: 'myapp' });
await db.connect();

setUserContext({ actorType: 'USER', appUserId: 123, appUsername: 'john.doe' });
await db.query('UPDATE users SET email = $1 WHERE id = $2', ['new@example.com', 123]);`,
  },
  {
    key: "mysql",
    label: "MySQL",
    emoji: "🐬",
    driverCmd: "npm install mysql2",
    snippet: `import { initAudit, createAuditedMySQLClient, setUserContext } from '@panoptes/sdk';
import mysql from 'mysql2/promise';

initAudit({ appName: 'mysql-app', transports: { enabled: ['console'] } });

const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'password', database: 'mydb' });
const db = createAuditedMySQLClient(conn, { host: 'localhost', database: 'mydb' });

setUserContext({ actorType: 'USER', appUserId: 1, appUsername: 'admin' });
const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [1]);`,
  },
  {
    key: "mssql",
    label: "MSSQL",
    emoji: "🪟",
    driverCmd: "npm install mssql",
    snippet: `import { initAudit, createAuditedMSSQLClient, setUserContext } from '@panoptes/sdk';
import mssql from 'mssql';

initAudit({ appName: 'mssql-app', transports: { enabled: ['console'] } });

const pool = await mssql.connect({ user: 'sa', password: 'password', server: 'localhost', database: 'mydb' });
const db = createAuditedMSSQLClient(pool, { host: 'localhost', database: 'mydb' });

setUserContext({ actorType: 'USER', appUserId: 'sa', appUsername: 'sa' });
await db.request().query('UPDATE products SET stock = stock - 1 WHERE id = 42');`,
  },
  {
    key: "sqlite",
    label: "SQLite",
    emoji: "🧊",
    driverCmd: "npm install sqlite3",
    snippet: `import { initAudit, createAuditedSQLiteClient, setUserContext } from '@panoptes/sdk';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

initAudit({ appName: 'sqlite-app', transports: { enabled: ['console'] } });

const raw = await open({ filename: 'mydb.sqlite', driver: sqlite3.Database });
const db = createAuditedSQLiteClient(raw, { database: 'mydb.sqlite' });

setUserContext({ actorType: 'SYSTEM', appUserId: 'svc', appUsername: 'system' });
await db.run('INSERT INTO logs (message) VALUES (?)', ['hello']);`,
  },
];

export function DbQuickstartTabs() {
  const [active, setActive] = useState<DbOption>(dbOptions[0]);

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        {dbOptions.map((db) => (
          <Button
            key={db.key}
            variant="link"
            size="sm"
            className={cn(
              "px-0 py-1 font-semibold no-underline",
              active.key === db.key
                ? "text-indigo-500 dark:text-violet-400 underline underline-offset-8 decoration-2"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-200"
            )}
            onClick={() => setActive(db)}
          >
            <span className="text-base">{db.emoji}</span>
            {db.label}
          </Button>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-950/90 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
          <Badge variant="outline">{active.label}</Badge>
          <span className="text-slate-600 dark:text-slate-400">
            <span className="lang-en">Driver install:</span>
            <span className="lang-es">Instala el driver:</span>
          </span>
        </div>
        <CodeBlock language="bash" code={active.driverCmd} />
        <CodeBlock language="javascript" code={active.snippet} />
      </div>
    </>
  );
}
