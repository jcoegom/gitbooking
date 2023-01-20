import "./Body.css";

type BodyProps = {
  children: React.ReactNode;
  className?: string;
};

const Body: React.FC<BodyProps> = ({ children, className = "" }) => {
  return <div className={className || "body-main"}>{children}</div>;
};

export default Body;
