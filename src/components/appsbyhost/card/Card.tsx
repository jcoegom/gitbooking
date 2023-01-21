import "./Card.css";

type CardProps = {
  hostname: string;
  appNameApdexs: { name: string; apdex: number }[];
  mainClass?: string;
};

const Card = ({
  hostname = "",
  appNameApdexs = [],
  mainClass = "",
}: CardProps) => {
  return (
    <div className={mainClass || "appsbyhost-card"}>
      <div className="appsbyhost-card-body">
        <div className="appsbyhost-card-title">{hostname}</div>
        <div className="appsbyhost-card-container">
          {appNameApdexs &&
            appNameApdexs.map((item) => (
              <>
                <div className="appsbyhost-card-item-apdex">{item.apdex}</div>
                <div className="appsbyhost-card-item-description">
                  {item.name}
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
