import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ChartGallery from "./ChartGallery";

describe("ChartGallery", () => {
  it("renders every chart card with its heading and summary", () => {
    const { container } = render(<ChartGallery />);
    expect(screen.getByLabelText("Chart component examples")).toBeInTheDocument();
    for (const title of [
      "Area chart",
      "Bar chart",
      "Line chart",
      "Pie chart",
      "Radar chart",
      "Radial chart",
      "Donut chart",
      "Chart tooltip",
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(container.querySelectorAll(".chart-stage")).toHaveLength(8);
  });

  it("renders the area chart axes and series", () => {
    render(<ChartGallery />);
    const cards = screen.getAllByRole("heading", { name: "Area chart" });
    expect(cards).toHaveLength(1);
    expect(screen.getByText("Engagement")).toBeInTheDocument();
    expect(screen.getByText("+18.4%")).toBeInTheDocument();
  });

  it("renders the pie legend with device shares", () => {
    render(<ChartGallery />);
    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
    expect(screen.getByText("48%")).toBeInTheDocument();
    expect(screen.getByText("27%")).toBeInTheDocument();
  });

  it("renders the radial and donut center readouts", () => {
    render(<ChartGallery />);
    expect(screen.getByText("84%")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByText("68%")).toBeInTheDocument();
    expect(screen.getByText("34.2 GB")).toBeInTheDocument();
  });

  it("renders an SVG surface for every recharts chart", () => {
    const { container } = render(<ChartGallery />);
    expect(container.querySelectorAll("svg.recharts-surface")).toHaveLength(8);
  });
});
