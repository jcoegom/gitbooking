type ErrorProps = {
  children: React.ReactNode;
  show: boolean;
};

const AppError: React.FC<ErrorProps> = ({ children, show }) => {
  return <>{show ? <div>{children}</div> : null}</>;
};

export default AppError;
