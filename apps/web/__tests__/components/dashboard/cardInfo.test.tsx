import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CardInfo } from "@/components/dashboard/cardInfo";

const title = "My title";
const content = "10 users";
const subContent = "more to come";
const defaultProps = { title, content, subContent, icon: "users" } as const;

describe("CardInfo", () => {
  it("renders correctly with minimal props", () => {
    render(<CardInfo {...defaultProps} />);

    const titleElement = screen.getByText(title);
    const contentElement = screen.getByText(content);
    const subContentElement = screen.getByText(subContent);
    const nonExistingLoadingElements = screen.queryAllByTestId("skeleton");
    const nonExistingLinkElement = screen.queryByRole("link");

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
    expect(subContentElement).toBeInTheDocument();

    expect(nonExistingLoadingElements).toHaveLength(0);
    expect(nonExistingLinkElement).toBeNull();
  });

  it("renders loading state when props is set to loading", () => {
    render(<CardInfo {...defaultProps} loading />);

    const skeletonElements = screen.getAllByTestId("skeleton");

    skeletonElements.map((skeletonElement) =>
      expect(skeletonElement).toBeInTheDocument()
    );
    expect(skeletonElements).toHaveLength(2);
  });

  it("renders a link when link props is set", () => {
    const link = "/test-link";

    render(<CardInfo {...defaultProps} link={link} />);

    const linkElement = screen.getByRole("link");

    expect(linkElement).toBeInTheDocument();
  });

  it("renders error when error props are set", () => {
    const errorMessage = "there is an error";

    render(<CardInfo {...defaultProps} errored errorMessage={errorMessage} />);

    const errorMessageElement = screen.getByText(errorMessage);

    expect(errorMessageElement).toBeInTheDocument();
  });

  it("renders default error  when error props is set and no message", () => {
    const errorMessage = "There was an error fetching the data";

    render(<CardInfo {...defaultProps} errored />);

    const errorMessageElement = screen.getByText(errorMessage);

    expect(errorMessageElement).toBeInTheDocument();
  });
});
