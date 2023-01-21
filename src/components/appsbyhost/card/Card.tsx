import "./Card.css";

export type CardProps = {
  hostname: string;
  appNameApdexs: { name: string; apdex: number; version: number }[];
  mainClass?: string;
  onClick: (version: number) => void;
};

const Card = ({
  hostname = "",
  appNameApdexs = [],
  mainClass = "",
  onClick,
}: CardProps) => {
  console.log("+++++++++++", appNameApdexs);
  return (
    <div
      data-testId="appsbyhost-card"
      className={mainClass || "appsbyhost-card"}
    >
      <div className="appsbyhost-card-body">
        <div
          data-testId="appsbyhost-card-title"
          className="appsbyhost-card-title"
        >
          {hostname}
        </div>
        <div className="appsbyhost-card-container">
          {appNameApdexs &&
            appNameApdexs.map((item) => (
              <>
                <div
                  data-testId="appsbyhost-card-item-apdex"
                  className="appsbyhost-card-item-apdex"
                >
                  {item.apdex}
                </div>
                <div
                  onClick={(e) => onClick(item.version)}
                  className="appsbyhost-card-item-description"
                  data-testId="appsbyhost-card-item-description"
                >
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
