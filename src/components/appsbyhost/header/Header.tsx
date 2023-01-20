import "./Header.css";

type HeaderProps = {
  user: string;
  actions: React.ReactNode;
};

const Header = ({ user, actions = <span></span> }: HeaderProps) => {
  return (
    <div className="header-main">
      <div>
        <span className="header-title">Apps by Host</span>
        <span className="header-user">{` for user ${user}`}</span>
      </div>
      <div className="header-actions">{actions}</div>
    </div>
  );
};

export default Header;
