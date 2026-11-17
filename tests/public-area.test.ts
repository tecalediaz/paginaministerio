import assert from "node:assert/strict";
import test from "node:test";

import { resolveSubmissionArea, toPublicAreaView } from "../lib/public-area";

const base = {
  slug: "deportes",
  name: "Deportes",
  kind: "Secretaría" as const,
  need: "deporte" as const,
  summary: "",
  coverUrl: null,
};

test("public view hides empty blocks and drops secrets", () => {
  const view = toPublicAreaView(
    { slug: "deportes", name: "Deportes", kind: "Secretaría", need: "deporte", summary: "  ", coverUrl: null },
    [{ name: "", address: "Av. Alem 1", hours: "", latitude: null, longitude: null, sortOrder: 1 }],
    [{ platform: "INSTAGRAM", profileUrl: " https://instagram.com/deporte ", password: "secreto" } as { platform: string; profileUrl?: string }],
  );
  assert.equal(view.summary, null);
  assert.equal(view.coverUrl, null);
  assert.equal(view.social.length, 1);
  assert.equal(view.social[0].href, "https://instagram.com/deporte");
  assert.equal(JSON.stringify(view).includes("secreto"), false);
  const empty = toPublicAreaView(
    { slug: "deportes", name: "Deportes", kind: "Secretaría", need: "deporte", summary: "", coverUrl: null },
    [],
    [{ platform: "INSTAGRAM", profileUrl: "" }],
  );
  assert.deepEqual(empty.social, []);
  assert.deepEqual(empty.sedes, []);
});

test("missing cover is a flag, not a stock photo", () => {
  const view = toPublicAreaView(base, [], []);
  assert.equal(view.coverUrl, null);
});

test("submission accepts only known stored slugs", () => {
  const known = new Set(["deportes", "atencion-sede"]);
  assert.equal(resolveSubmissionArea("general", known), "atencion-sede");
  assert.equal(resolveSubmissionArea("deportes", known), "deportes");
  assert.equal(resolveSubmissionArea("otra", known), null);
  assert.equal(resolveSubmissionArea("../x", known), null);
});
