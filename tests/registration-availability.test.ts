import assert from "node:assert/strict";
import test from "node:test";
import { registrationAvailability } from "../lib/registration-availability";

const now = Date.parse("2026-10-06T12:00:00Z");
test("registration availability respects capacity, manual close and exact schedule boundaries", () => {
  assert.equal(registrationAvailability({ capacity: 2 }, 1, now).remaining, 1);
  assert.equal(registrationAvailability({ capacity: 2 }, 2, now).status, "full");
  assert.equal(registrationAvailability({ capacity: 2, closed: true }, 0, now).status, "closed");
  assert.equal(registrationAvailability({ capacity: 2, opensAt: "2026-10-06T12:00:01Z" }, 0, now).status, "scheduled");
  assert.equal(registrationAvailability({ capacity: 2, opensAt: "2026-10-06T12:00:00Z" }, 0, now).status, "open");
  assert.equal(registrationAvailability({ capacity: 2, closesAt: "2026-10-06T12:00:00Z" }, 0, now).status, "closed");
  for (const capacity of [0, "20", 1.2, 100001]) assert.equal(registrationAvailability({ capacity }, 0, now).status, "unavailable");
});
