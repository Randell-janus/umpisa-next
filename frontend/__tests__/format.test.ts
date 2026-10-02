import { describe, expect, it } from "vitest";

import { countWeekdays, formatDateRange, formatDays } from "@/lib/format";

describe("countWeekdays", () => {
  it("counts a single weekday", () => {
    expect(countWeekdays("2026-10-05", "2026-10-05")).toBe(1);
  });

  it("skips weekends", () => {
    expect(countWeekdays("2026-10-05", "2026-10-11")).toBe(5);
  });

  it("returns 0 for weekend only", () => {
    expect(countWeekdays("2026-10-10", "2026-10-11")).toBe(0);
  });

  it("returns 0 when end is before start", () => {
    expect(countWeekdays("2026-10-09", "2026-10-05")).toBe(0);
  });

  it("returns 0 when a date is missing", () => {
    expect(countWeekdays("2026-10-05", "")).toBe(0);
  });
});

describe("formatDays", () => {
  it("uses singular for one day", () => {
    expect(formatDays(1)).toBe("1 day");
  });

  it("uses plural for more than one day", () => {
    expect(formatDays(3)).toBe("3 days");
  });
});

describe("formatDateRange", () => {
  it("shows a single date when start and end are the same", () => {
    expect(formatDateRange("2026-10-05", "2026-10-05")).toBe("Oct 5, 2026");
  });

  it("shows both dates for a range", () => {
    expect(formatDateRange("2026-10-05", "2026-10-07")).toBe("Oct 5, 2026 - Oct 7, 2026");
  });
});
