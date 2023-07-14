import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "@/components/dashboard/header";
import { OrganizationsCard } from "@/components/dashboard/organizationsCard";
import GlobalProvider from "@/components/contexts";
import { SWRConfig } from "swr";

// TODO MSW not working yet with app router
// follow along with https://github.com/mswjs/msw/issues/1644
describe("OrganizationsCard", () => {
  it("renders correctly with datas loaded from msw", async () => {
    render(
      <GlobalProvider>
        <SWRConfig value={{ provider: () => new Map() }}>
          <Header onLogout={() => {}} />
          <OrganizationsCard />
        </SWRConfig>
      </GlobalProvider>
    );

    // Use waitFor because there are api calls that are made
    const CardInfoTitleElement = await waitFor(() =>
      screen.getByText("Organizations")
    );

    const CardContentContent = await waitFor(() =>
      screen.getByTestId("CardContentContent")
    );

    expect(CardInfoTitleElement).toBeInTheDocument();
    expect(CardContentContent).toBeInTheDocument();
  });
});
