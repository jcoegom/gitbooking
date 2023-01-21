import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Card, { CardProps } from "./Card";

describe("Card", () => {
  let props: CardProps;
  let onClickMock: jest.Mock;
  beforeEach(() => {
    onClickMock = jest.fn();
    props = {
      hostname: "localhost",
      appNameApdexs: [
        {
          name: "App1",
          apdex: 90,
          version: 1,
        },
        {
          name: "App2",
          apdex: 80,
          version: 2,
        },
      ],
      mainClass: "mainClass",
      onClick: onClickMock,
    };
  });

  it("should render without crashing", () => {
    const { container } = render(<Card {...props} />);
    expect(container).toBeTruthy();
  });

  it('should have a class name of "appsbyhost-card"', () => {
    const { getByTestId } = render(<Card {...props} />);
    const appsbyhostCard = getByTestId("appsbyhost-card");
    expect(appsbyhostCard).toBeInTheDocument();
  });

  it('should have a class name of "mainClass"', () => {
    const { getByTestId } = render(<Card {...props} />);
    const mainClass = getByTestId("appsbyhost-card");
    expect(mainClass).toHaveClass("mainClass");
    expect(mainClass).not.toHaveClass("appsbyhost-card");
  });

  it("should have the correct title", () => {
    const { getByText } = render(<Card {...props} />);
    const title = getByText(props.hostname);
    expect(title).toHaveTextContent(props.hostname);
  });

  it("should call the onClick function when the item is clicked", () => {
    const { getAllByTestId } = render(<Card {...props} />);
    const items = getAllByTestId("appsbyhost-card-item-description");
    fireEvent.click(items[0]);
    expect(onClickMock).toHaveBeenCalledWith(1);
  });

  it("should render the correct apdex and name for each item", () => {
    const { getAllByTestId } = render(<Card {...props} />);
    const apdexes = getAllByTestId("appsbyhost-card-item-apdex");
    const names = getAllByTestId("appsbyhost-card-item-description");
    expect(apdexes[0].textContent).toBe("" + props.appNameApdexs[0].apdex);
    expect(names[0]).toHaveTextContent(props.appNameApdexs[0].name);
    expect(apdexes[1].textContent).toBe("" + props.appNameApdexs[1].apdex);
    expect(names[1]).toHaveTextContent(props.appNameApdexs[1].name);
  });
});
