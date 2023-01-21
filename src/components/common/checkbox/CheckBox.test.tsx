import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CheckBox, { CheckBoxProps } from "./CheckBox";

describe("CheckBox", () => {
  let props: CheckBoxProps;
  let onChangeMock: jest.Mock;
  beforeEach(() => {
    onChangeMock = jest.fn();
    props = {
      label: "Test Checkbox",
      checked: false,
      onChange: onChangeMock,
    };
  });

  it("should render without crashing", () => {
    const { container } = render(<CheckBox {...props} />);
    expect(container).toBeTruthy();
  });

  it('should have a class name of "checkbox-container"', () => {
    const { getByTestId } = render(<CheckBox {...props} />);
    const checkboxContainer = getByTestId("checkbox-container");
    expect(checkboxContainer).toBeInTheDocument();
  });

  it("should have an input element with the correct props", () => {
    const { getByTestId } = render(<CheckBox {...props} />);
    const input = getByTestId("checkbox-input");
    expect(input.getAttribute("type")).toBe("checkbox");
    expect(input).not.toBeChecked();
  });

  it("should have a label element with the correct props", () => {
    const { getByTestId } = render(<CheckBox {...props} />);
    const label = getByTestId("checkbox-label");
    expect(label).toHaveTextContent(props.label);
  });

  it("should call the onChange function when the input is clicked", () => {
    const { getByTestId } = render(<CheckBox {...props} />);
    const input = getByTestId("checkbox-input");
    fireEvent.click(input);
    expect(onChangeMock).toHaveBeenCalled();
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});
