import "./Layout.css";
type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return <div className="layout-main">{children}</div>;
};

export default Layout;
