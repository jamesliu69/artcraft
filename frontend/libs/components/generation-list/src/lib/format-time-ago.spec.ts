import { afterEach, describe, expect, it, vi } from "vitest";
import { formatTimeAgo } from "./format-time-ago";

describe("formatTimeAgo", () => {
  afterEach(() => vi.useRealTimers());

  it("keeps the default English relative time and interpolates its count", () => {
    const now = new Date("2026-10-09T00:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);

    expect(formatTimeAgo(new Date(now.getTime() - 5 * 60_000))).toBe(
      "5 minutes ago",
    );
  });
});
