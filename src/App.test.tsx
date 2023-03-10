import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import useGetData from "./components/appsbyhost/processdata/UseGetData";
jest.mock("./components/appsbyhost/processdata/UseGetData");

describe("App. Testing initial state with loading", () => {
  beforeEach(() => {
    (useGetData as jest.Mock).mockImplementation(() => {
      return [true, null, null];
    });
  });
  it("should render without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("should render only Loading component", () => {
    const { getByTestId } = render(<App />);
    const loading = getByTestId("loading-main");
    expect(loading).toBeInTheDocument();
  });
  it("should not  render error component", () => {
    const { queryByTestId } = render(<App />);
    const error = queryByTestId("error-main");
    expect(error).not.toBeInTheDocument();
  });
  it("should render no cards", () => {
    const { queryByTestId } = render(<App />);
    const card = queryByTestId("appsbyhost-card");
    expect(card).not.toBeInTheDocument();
  });
});

describe("App. Testing error state", () => {
  beforeEach(() => {
    (useGetData as jest.Mock).mockImplementation(() => {
      return [false, new Error("Error getting data"), null];
    });
  });

  it("should render without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("should not render loading component", () => {
    const { queryByTestId } = render(<App />);
    const loading = queryByTestId("loading-main");
    expect(loading).not.toBeInTheDocument();
  });

  it("should render error component", () => {
    const { getByTestId } = render(<App />);
    const error = getByTestId("error-main");
    expect(error).toBeInTheDocument();
  });

  it("should render no cards", () => {
    const { queryByTestId } = render(<App />);
    const card = queryByTestId("appsbyhost-card");
    expect(card).not.toBeInTheDocument();
  });
});

describe("App. Testing result data received", () => {
  beforeEach(() => {
    (useGetData as jest.Mock).mockImplementation(() => {
      return [
        false,
        null,
        { host1: { appsSorted: [{ apdex: 80, name: "app1", version: 1 }] } },
      ];
    });
  });

  it("should render without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("should not render loading component", () => {
    const { queryByTestId } = render(<App />);
    const loading = queryByTestId("loading-main");
    expect(loading).not.toBeInTheDocument();
  });

  it("should not render error component", () => {
    const { queryByTestId } = render(<App />);
    const error = queryByTestId("error-main");
    expect(error).not.toBeInTheDocument();
  });

  it("should render one cards", () => {
    const { queryByTestId } = render(<App />);
    const card = queryByTestId("appsbyhost-card");
    expect(card).toBeInTheDocument();
  });

  it("Test title is in the document", () => {
    const { queryAllByTestId } = render(<App />);
    const card = queryAllByTestId("appsbyhost-card-title");
    expect(card.length).toBe(1);
    expect(card[0].textContent).toBe("host1");
  });

  it("Test apdex and app name are in the document", () => {
    const { getByTestId } = render(<App />);
    const card = getByTestId("appsbyhost-card-item-apdex");
    expect(card?.textContent).toBe("80");
    const name = getByTestId("appsbyhost-card-item-description");
    expect(name?.textContent).toBe("app1");
  });

  it("Test if checkbox is disabled", () => {
    const { getByTestId } = render(<App />);
    const input = getByTestId("checkbox-input");
    expect(input).not.toBeChecked();
  });
});

describe("App. Testing alert event", () => {
  beforeEach(() => {
    (useGetData as jest.Mock).mockImplementation(() => {
      return [
        false,
        null,
        { host1: { appsSorted: [{ apdex: 80, name: "app1", version: 1 }] } },
      ];
    });

    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    (window.alert as any).mockRestore();
  });

  it("Test if alert has right data after clicking in application description", () => {
    const { getByTestId } = render(<App />);
    const description = getByTestId("appsbyhost-card-item-description");
    fireEvent.click(description);
    expect(window.alert).toHaveBeenCalledWith("Version: 1");
  });
});
