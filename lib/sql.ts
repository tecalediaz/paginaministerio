import "server-only";
import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

const POOL_MAX = 4;

const globalForSql = globalThis as typeof globalThis & { sqlClientsV2?: Map<string, Sql> };
const clients = globalForSql.sqlClientsV2 ?? new Map<string, Sql>();
globalForSql.sqlClientsV2 = clients;

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
    max: POOL_MAX,
    ssl: "require",
    prepare: false,
    idle_timeout: 5,
    connect_timeout: 15,
  });
  clients.set(target, sql);
  return sql;
}
