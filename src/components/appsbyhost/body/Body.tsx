import "./Body.css";

type BodyProps = {
  children: React.ReactNode;
  className?: string;
  show: boolean;
};

const Body: React.FC<BodyProps> = ({ children, className = "", show }) => {
  return (
    <>
      {show ? (
        <div
          data-testId="appsbyhost-body-main"
          className={className || "body-main"}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};

export default Body;
