import "./Header.css";

type HeaderProps = {
  user: string;
  actions: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ user, actions = <span></span> }) => {
  return (
    <div className="header-main">
      <div className="header-title">
        Apps by Host
        <span className="header-user">{` for user ${user}`}</span>
      </div>
      <div className="header-actions">{actions}</div>
    </div>
  );
};

export default Header;
