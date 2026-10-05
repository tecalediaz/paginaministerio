import assert from "node:assert/strict";
import test from "node:test";
import { bookingAvailability } from "../lib/booking-availability";
const now = Date.parse("2026-10-04T12:00:00Z");
const slots = [
  { id: "open", date: "2026-10-11T16:00:00Z", capacity: 2 },
  { id: "full", date: "2026-10-12T16:00:00Z", capacity: 1 },
  { id: "past", date: "2026-10-01T16:00:00Z", capacity: 1 },
];
const options = slots.map(slot => ({ value: slot.id, label: slot.date }));
test("offers available dates, keeps a notice for full dates and excludes expired dates", () => {
  const result = bookingAvailability(slots, { open: 1, full: 1, past: 1 }, options, now);
  assert.deepEqual(result.options.map(option => option.value), ["open"]);
  assert.deepEqual(result.fullDates.map(date => date.id), ["full"]);
});
test("all dates full means no fields can offer a reservation; missing counts means zero bookings", () => {
  assert.equal(bookingAvailability(slots, { open: 2, full: 1 }, options, now).options.length, 0);
  assert.equal(bookingAvailability(slots, null, options, now).options.length, 2);
});
