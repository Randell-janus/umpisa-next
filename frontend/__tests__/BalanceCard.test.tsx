import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BalanceCard from "@/components/BalanceCard";

describe("BalanceCard", () => {
  it("shows the leave type and remaining days", () => {
    render(
      <BalanceCard
        balance={{
          id: "1",
          leaveType: "VACATION",
          allocatedDays: 15,
          usedDays: 2,
          remainingDays: 13,
        }}
      />,
    );

    expect(screen.getByText("Vacation leave")).toBeTruthy();
    expect(screen.getByText("13")).toBeTruthy();
    expect(screen.getByText("days left of 15 (2 used)")).toBeTruthy();
  });
});
