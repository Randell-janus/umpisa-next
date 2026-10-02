import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatusBadge from "@/components/StatusBadge";

describe("StatusBadge", () => {
  it("shows the label for the status", () => {
    render(<StatusBadge status="APPROVED" />);

    expect(screen.getByText("Approved")).toBeTruthy();
  });

  it("uses different styles per status", () => {
    const { rerender } = render(<StatusBadge status="APPROVED" />);
    const approvedClass = screen.getByText("Approved").className;

    rerender(<StatusBadge status="PENDING" />);
    const pendingClass = screen.getByText("Pending").className;

    expect(approvedClass).not.toBe(pendingClass);
  });
});
