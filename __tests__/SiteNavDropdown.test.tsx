import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SiteNavDropdown from "@/components/SiteNavDropdown";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/quotes", label: "Quotes Discovery" },
  { href: "/iaffirmations", label: "I - Affirmations" },
  { href: "/you-affirmations", label: "You - Affirmations" },
  { href: "/ai-journal", label: "AI Journal" },
  { href: "/my-inspirations", label: "My Inspirations" },
  { href: "/journal", label: "Journal" },
  { href: "/emotional-coach", label: "Emotional Coach" },
  { href: "/ai-kick-in-the-pants", label: "AI Kick in the Pants" },
  { href: "/ai-motivate-me-now", label: "AI Motivate Me Now" },
  { href: "/ai-speeches", label: "AI Speeches" },
];

describe("SiteNavDropdown", () => {
  it("shows every navigation link with the correct destination", async () => {
    render(<SiteNavDropdown />);

    await userEvent.click(screen.getByRole("button", { name: /navigate/i }));

    for (const link of NAV_LINKS) {
      const navLink = screen.getByRole("link", { name: link.label });
      expect(navLink).toHaveAttribute("href", link.href);
    }
  });

  it("closes the menu after selecting a link", async () => {
    render(<SiteNavDropdown />);

    await userEvent.click(screen.getByRole("button", { name: /navigate/i }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("link", { name: NAV_LINKS[0].label }));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});


