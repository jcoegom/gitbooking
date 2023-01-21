type SeparatorProps = {
  size: string;
};

const Separator: React.FC<SeparatorProps> = ({ size = "20px" }) => {
  return <div style={{ height: size }}></div>;
};

export default Separator;
