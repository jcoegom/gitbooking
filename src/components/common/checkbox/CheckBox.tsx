import "./CheckBox.css";

type CheckBoxProps = {
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
    <div className="checkbox-container">
      <input
        type="checkbox"
        id={`checkbox-${label}`}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={`checkbox-${label}`}>{label}</label>
    </div>
  );
};

export default CheckBox;
