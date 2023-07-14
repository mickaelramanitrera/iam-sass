import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrganizationCardsList } from "@/components/dashboard/organizations/organizationCardsList";
import { KeycloakOrganizationObject } from "keycloak-lib";

describe("OrganizationCardsList", () => {
  it("renders correctly when loading", () => {
    render(<OrganizationCardsList loading />);

    const skeletonElements = screen.getAllByTestId("skeleton");

    skeletonElements.map((el) => {
      expect(el).toBeInTheDocument();
    });
  });

  it("renders correctly when not loading and no organizations passed", () => {
    render(<OrganizationCardsList organizations={[]} />);

    const notExistingCards = screen.queryAllByTestId(
      "organization-sheet-button-card"
    );

    expect(notExistingCards).toHaveLength(0);
  });

  it("renders correctly when not loading and organizations passed", () => {
    const baseOrganization = {
      id: "abcdef",
      name: "My keycloak org",
      description: "There is one description",
      path: "path/c/d/e/f",
    };

    const organizations: KeycloakOrganizationObject[] = [
      { ...baseOrganization, id: "abc", name: "KC big" },
      { ...baseOrganization, id: "def", name: "IJ bi" },
      { ...baseOrganization, id: "ghij" },
    ];

    render(<OrganizationCardsList organizations={organizations} />);

    const cardElements = screen.getAllByTestId(
      "organization-sheet-button-card"
    );

    cardElements.map((el, id) => {
      expect(el).toBeInTheDocument();

      const titleElement = screen.getByText(organizations[id].name);
      expect(titleElement).toBeInTheDocument();
    });

    expect(cardElements).toHaveLength(organizations.length);
  });
});
