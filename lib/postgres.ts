import { Pool, type QueryResultRow } from "pg";

const pools = new Map<string, Pool>();

export function getPool(connectionString: string) {
  const existing = pools.get(connectionString);
  if (existing) return existing;
  const url = new URL(connectionString);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  url.searchParams.delete("sslmode");
  const pool = new Pool({
    connectionString: url.toString(),
    max: 1,
    ssl: local ? undefined : { rejectUnauthorized: false },
  });
  pools.set(connectionString, pool);
  return pool;
}

type Row = QueryResultRow;

export type SqlQuery = PromiseLike<Row[]> & {
  text: string;
  values: unknown[];
};

export type Sql = {
  (strings: TemplateStringsArray, ...values: unknown[]): SqlQuery;
  query: (text: string, values?: unknown[]) => SqlQuery;
  transaction: (queries: SqlQuery[]) => Promise<Row[][]>;
};

function pending(run: () => Promise<Row[]>, text: string, values: unknown[]): SqlQuery {
  let started: Promise<Row[]> | undefined;
  return {
    text,
    values,
    then(onFulfilled, onRejected) {
      started ??= run();
      return started.then(onFulfilled, onRejected);
    },
  };
}

/**
 * Misma forma que el cliente HTTP de Neon, sobre el driver `pg`.
 * AlMinisterio guarda en Postgres estándar (Supabase). El driver HTTP no llega a ese host.
 */
export function neon(connectionString: string): Sql {
  const pool = getPool(connectionString);

  const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
    let text = "";
    strings.forEach((chunk, index) => {
      text += chunk;
      if (index < values.length) text += `$${index + 1}`;
    });
    return pending(() => pool.query(text, values).then((result) => result.rows), text, values);
  }) as Sql;

  sql.query = (text, values = []) =>
    pending(() => pool.query(text, values).then((result) => result.rows), text, values);

  sql.transaction = async (queries) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const results: Row[][] = [];
      for (const query of queries) {
        const result = await client.query(query.text, query.values);
        results.push(result.rows);
      }
      await client.query("COMMIT");
      return results;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  return sql;
}
