import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./progress-bar";

describe("ProgressBar", () => {
  it("exposes the value via aria attribute", () => {
    render(<ProgressBar value={49} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "49");
  });
  it("clamps the value between 0 and 100", () => {
    render(<ProgressBar value={250} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});
