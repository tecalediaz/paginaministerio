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
