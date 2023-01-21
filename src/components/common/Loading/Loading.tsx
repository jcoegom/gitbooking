type LoadingProps = {
  children: React.ReactNode;
  show: boolean;
};

const Loading: React.FC<LoadingProps> = ({ children, show }) => {
  return <>{show ? <div>{children}</div> : null}</>;
};

export default Loading;
