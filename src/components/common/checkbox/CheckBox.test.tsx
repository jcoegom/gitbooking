import React from "react";
import { shallow } from "enzyme";
import CheckBox, { CheckBoxProps } from "./CheckBox";

describe("CheckBox", () => {
  let props: CheckBoxProps;
  let wrapper: any;

  beforeEach(() => {
    props = {
      label: "Test Checkbox",
      checked: false,
      onChange: jest.fn(),
    };
    wrapper = shallow(<CheckBox {...props} />);
  });

  it("should render without crashing", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should have a class name of "checkbox-container"', () => {
    expect(wrapper.find(".checkbox-container").length).toBe(1);
  });

  it("should have an input element with the correct props", () => {
    const input = wrapper.find("input");
    expect(input.prop("type")).toBe("checkbox");
    expect(input.prop("id")).toBe(`checkbox-${props.label}`);
    expect(input.prop("checked")).toBe(props.checked);
    expect(input.prop("onChange")).toBe(props.onChange);
  });

  it("should have a label element with the correct props", () => {
    const label = wrapper.find("label");
    expect(label.prop("htmlFor")).toBe(`checkbox-${props.label}`);
    expect(label.text()).toBe(props.label);
  });

  it("should call the onChange function when the input is clicked", () => {
    const input = wrapper.find("input");
    input.simulate("change");
    expect(props.onChange).toHaveBeenCalled();
  });
});
