type LoadingProps = {
  children: React.ReactNode;
  show: boolean;
};

const Loading: React.FC<LoadingProps> = ({ children, show }) => {
  return <>{show ? <div data-testId="loading-main">{children}</div> : null}</>;
};

export default Loading;
