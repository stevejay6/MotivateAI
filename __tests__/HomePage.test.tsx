import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

describe("Home page", () => {
  it("renders the main heading and navigation link", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "Quotes Discovery" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Explore Quotes" });
    expect(link).toHaveAttribute("href", "/quotes");
  });
});


