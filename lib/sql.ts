import "server-only";
import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

const clients = new Map<string, Sql>();

export function sqlFor(url: string): Sql {
  const existing = clients.get(url);
  if (existing) return existing;
  const sql = postgres(url, {
    max: 3,
    ssl: "require",
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 15,
  });
  clients.set(url, sql);
  return sql;
}
