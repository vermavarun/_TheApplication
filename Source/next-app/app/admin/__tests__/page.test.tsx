import { render, screen, waitFor } from "@testing-library/react";
import Home from "../page";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useRouter } from "next/navigation"; // Import mocked router

// Enable fetch mocking
fetchMock.enableMocks();

const mockStore = configureStore([]);
const store = mockStore({});

// Mock the Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Home Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() }); // Mock router behavior
  });

  const renderWithRedux = (component: JSX.Element) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  it("fetches and displays users", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        "1": { id: "1", email: "user1@example.com" },
        "2": { id: "2", email: "user2@example.com" },
      })
    );

    renderWithRedux(<Home />);

    expect(screen.getByText("This is admin Page")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
      expect(screen.getByText("user2@example.com")).toBeInTheDocument();
    });
  });

  it("handles fetch error gracefully", async () => {
    fetchMock.mockReject(new Error("API Failure"));

    renderWithRedux(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("ID:")).not.toBeInTheDocument();
      expect(screen.queryByText("Email:")).not.toBeInTheDocument();
    });
  });
});
