import { useEffect, useMemo, useState } from "react";

type Row = {
  id: number;
  type: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "DROP" | "TRUNCATE";
  command: string;
  table: string;
  user: string;
  ip: string;
  time: string;
  diff: string;
};

const TABLES = [
  "users",
  "orders",
  "sessions",
  "products",
  "inventory",
  "audit_logs",
  "tokens",
  "webhooks",
  "notifications",
  "config",
  "transactions",
  "cart_items",
];

const USERS = [
  "admin@company.io",
  "api-service",
  "monitor-svc",
  "auth-service",
  "devops-team",
  "cron-worker",
  "warehouse-svc",
  "finance-svc",
];

const TYPES: Row["type"][] = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "TRUNCATE"];

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

function formatTimestamp(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function randomIp() {
  return `${10 + Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
}

function randomId() {
  return Math.floor(Math.random() * 90000) + 10000;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildCommand(type: Row["type"], table: string) {
  switch (type) {
    case "SELECT":
      return `SELECT * FROM ${table} WHERE id = ${Math.floor(Math.random() * 9000) + 100}`;
    case "INSERT":
      return `INSERT INTO ${table} (id, status) VALUES (${Math.floor(Math.random() * 9000) + 100}, 'active')`;
    case "UPDATE":
      return `UPDATE ${table} SET status = 'active' WHERE id = ${Math.floor(Math.random() * 9000) + 100}`;
    case "DELETE":
      return `DELETE FROM ${table} WHERE archived = true`;
    case "DROP":
      return `DROP TABLE IF EXISTS ${table}_backup CASCADE`;
    case "TRUNCATE":
      return `TRUNCATE TABLE ${table}_temp RESTART IDENTITY`;
    default:
      return "";
  }
}

function buildDiff(type: Row["type"]) {
  if (type === "UPDATE") return "status: pending → active";
  if (type === "DELETE") return "rows removed";
  if (type === "INSERT") return "rows added";
  return "-";
}

function createRow(date: Date): Row {
  const type = randomFrom(TYPES);
  const table = randomFrom(TABLES);
  return {
    id: randomId(),
    type,
    command: buildCommand(type, table),
    table,
    user: randomFrom(USERS),
    ip: randomIp(),
    time: formatTimestamp(date),
    diff: buildDiff(type),
  };
}

export function SqlAuditTable() {
  const templateCols = "60px 110px 1.4fr 170px 170px 150px 190px 190px";
  const initialRows = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 12 }, (_, idx) => createRow(new Date(now - idx * 5000)));
  }, []);

  const [rows, setRows] = useState<Row[]>(() => initialRows);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [scanIndex, setScanIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRows((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        const updated = createRow(new Date());
        next[idx] = updated;
        next.sort((a, b) => (a.time > b.time ? -1 : 1));
        setActiveId(updated.id);
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanIndex((i) => ((i + 1) % rows.length) || 0);
    }, 750);
    return () => clearInterval(interval);
  }, [rows.length]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-cyan-400/40 bg-slate-950/80 shadow-2xl backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-slate-950/65" />
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

      <header className="flex items-center justify-between px-4 py-3 border-b border-cyan-400/30 bg-slate-900/70 backdrop-blur-sm">
        <h2 className="text-lg sm:text-xl font-black tracking-[0.25em] text-white">PANOPTES · AUDIT TRAIL</h2>
        <div className="flex items-center gap-2 text-xs text-cyan-100">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live feed</span>
        </div>
      </header>

      <div className="flex flex-col h-[calc(100%-52px)]">
        <div
          className="grid items-center bg-slate-900/70 px-4 py-3 text-[12px] font-semibold uppercase text-cyan-100 tracking-wide"
          style={{ gridTemplateColumns: templateCols }}
        >
          <div className="text-center">ID</div>
          <div>Type</div>
          <div>SQL Command</div>
          <div>Table</div>
          <div>User</div>
          <div>IP</div>
          <div>Timestamp</div>
          <div>Before/After</div>
        </div>

        <div className="flex flex-col flex-1">
          {rows.map((row, idx) => {
            const isActive = row.id === activeId || idx === scanIndex;
            return (
              <div
                key={row.id}
                className={`grid items-center px-4 py-3 text-[12px] md:text-sm font-mono border-b border-cyan-400/10 transition-all duration-500 ${
                  isActive ? "bg-white/5 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]" : ""
                }`}
                style={{ gridTemplateColumns: templateCols }}
              >
                <div className="text-center font-semibold text-cyan-200">{row.id}</div>
                <div className="flex items-center">
                  <span
                    className={`rounded border px-2 py-0.5 text-[11px] font-bold ${
                      row.type === "SELECT"
                        ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
                        : row.type === "INSERT"
                        ? "border-purple-400/40 bg-purple-500/15 text-purple-100"
                        : row.type === "UPDATE"
                        ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
                        : row.type === "DELETE"
                        ? "border-red-400/40 bg-red-500/15 text-red-100"
                        : "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
                    }`}
                  >
                    {row.type}
                  </span>
                </div>
                <div className="text-slate-100">{row.command}</div>
                <div className="text-slate-300">{row.table}</div>
                <div className="text-slate-300">{row.user}</div>
                <div className="text-slate-400">{row.ip}</div>
                <div className="text-slate-400">{row.time}</div>
                <div className="text-amber-200">{row.diff}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SqlAuditTable;
