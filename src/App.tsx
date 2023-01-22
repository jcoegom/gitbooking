import React, { useState } from "react";
import "./App.css";

import Layout from "./components/common/Layout/Layout";
import Card from "./components/appsbyhost/card/Card";
import Header from "./components/appsbyhost/header/Header";
import CheckBox from "./components/common/checkbox/CheckBox";
import Body from "./components/appsbyhost/body/Body";
import Loading from "./components/common/Loading/Loading";
import AppError from "./components/common/error/AppError";
import configApi from "./config/api.json";
import useGetData from "./components/appsbyhost/processdata/UseGetData";

function App() {
  const [load, error, result] = useGetData(configApi.url);
  const [showAsList, setShowList] = useState<boolean>(false);

  const onChangeCheck = (_event: React.ChangeEvent<HTMLInputElement>) => {
    setShowList((prevShowList) => !prevShowList);
  };

  return (
    <div className="App">
      <Layout>
        <Header
          user={"averylongemailadress@companyname.com"}
          actions={
            <CheckBox
              checked={showAsList}
              label={"Show as list"}
              onChange={onChangeCheck}
            />
          }
        />

        <Loading show={load}>
          <div style={{ marginTop: "40px" }}>
            Loading... <br />
            Please, wait only a moment!
          </div>
        </Loading>

        <AppError show={!!error}>
          <div style={{ marginTop: "40px" }}>Error fetching data</div>
        </AppError>

        <Body show={!!result} className={showAsList ? "body-main-list" : ""}>
          {result &&
            Object.keys(result || {}).map((host) => {
              return (
                <Card
                  key={host}
                  hostname={host}
                  appNameApdexs={result ? result[host].appsSorted : []}
                  mainClass={showAsList ? "appsbyhost-card-list" : ""}
                  onClick={(version) => alert("Version: " + version)}
                />
              );
            })}
        </Body>
      </Layout>
    </div>
  );
}

export default App;
