import assert from "node:assert/strict";
import { test } from "node:test";
import { getPool, neon } from "../lib/postgres";

const url = "postgres://pagina:pagina@127.0.0.1:1/pagina";

test("tagged queries use pg placeholders and do not connect until awaited", async () => {
  const sql = neon(url);
  const query = sql`SELECT id FROM site_tramites WHERE slug = ${"consulta"} AND published = ${true}`;
  assert.equal(
    query.text,
    "SELECT id FROM site_tramites WHERE slug = $1 AND published = $2",
  );
  assert.deepEqual(query.values, ["consulta", true]);
  await getPool(url).end();
});

test("production sslmode is kept and certificate checks are not disabled", async () => {
  const remote = "postgres://pagina:pagina@db.example.com:5432/postgres?sslmode=verify-full";
  const pool = getPool(remote);
  const ssl = pool.options.ssl;
  assert.match(String(pool.options.connectionString), /sslmode=verify-full/);
  if (ssl && typeof ssl === "object") {
    assert.notEqual(ssl.rejectUnauthorized, false);
  }
  await pool.end();
});
