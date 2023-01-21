import "./CheckBox.css";

export type CheckBoxProps = {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  checked = false,
  onChange,
}) => {
  return (
    <div data-testId="checkbox-container" className="checkbox-container">
      <input
        data-testId="checkbox-input"
        type="checkbox"
        id={`checkbox-${label}`}
        checked={checked}
        onChange={onChange}
      />
      <label data-testId="checkbox-label" htmlFor={`checkbox-${label}`}>
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
