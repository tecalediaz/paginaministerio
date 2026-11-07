import "server-only";
import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

const globalForSql = globalThis as typeof globalThis & { sqlClients?: Map<string, Sql> };
const clients = globalForSql.sqlClients ?? new Map<string, Sql>();
globalForSql.sqlClients = clients;

/** El pooler de Supabase en 5432 es modo sesión y solo admite 15 clientes. El 6543 es modo transacción. */
function pooledUrl(connectionString: string) {
  const url = new URL(connectionString);
  if (url.hostname.endsWith(".pooler.supabase.com") && (url.port === "" || url.port === "5432")) {
    url.port = "6543";
  }
  return url.toString();
}

export function sqlFor(url: string): Sql {
  const target = pooledUrl(url);
  const existing = clients.get(target);
  if (existing) return existing;
  const sql = postgres(target, {
    max: 1,
    ssl: "require",
    prepare: false,
    idle_timeout: 5,
    connect_timeout: 15,
  });
  clients.set(target, sql);
  return sql;
}
