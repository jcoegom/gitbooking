import React, { ReactElement, useEffect, useReducer, useState } from "react";
import "./App.css";

import axios from "axios";
import Layout from "./components/common/Layout/Layout";
import Card from "./components/appsbyhost/card/Card";
import Header from "./components/appsbyhost/header/Header";
import CheckBox from "./components/common/checkbox/CheckBox";
import Body from "./components/appsbyhost/body/Body";
import Loading from "./components/common/Loading/Loading";
import { ByHostDataType, ByAppDataType } from "./utils/dataHandler.d";
import { AppsByHost } from "./utils/dataHandler";
import { handleError } from "./utils/errors";
import AppError from "./components/common/error/AppError";
import configApi from "./config/api.json";

const useGetData = (url: string): [boolean, unknown, ByHostDataType | null] => {
  const [queryState, setQueryState] = useState<{
    //TODO: UseReducer
    load: boolean;
    error: unknown | null;
    result: ByHostDataType | null;
  }>({ load: false, error: null, result: null });

  useEffect(() => {
    setQueryState({ load: true, error: null, result: null });
    axios
      .get(url)
      .then((result) => {
        let appsByHost = new AppsByHost(result.data, 5);
        setQueryState({
          load: false,
          error: null,
          result: appsByHost.getAllDataSorted(),
        });
      })
      .catch((err) => {
        setQueryState({ load: false, error: err, result: null });
        handleError(err);
      })
      .finally(() => {
        setQueryState((prevQueryState) => ({ ...prevQueryState, load: false }));
      });
    //TODO: Abort query
  }, []);

  return [queryState.load, queryState.error, queryState.result];
};

function App() {
  const [load, error, result] = useGetData(configApi.url);

  return (
    <div className="App">
      <Layout>
        <Header
          user={"myuser@mail.com"}
          actions={
            <CheckBox
              checked={false}
              label={"Show as list"}
              onChange={() => {}}
            />
          }
        />

        <Loading show={load}>
          <div style={{ marginTop: "40px" }}>Please, wait only a moment! </div>
        </Loading>

        <AppError show={!!error}>
          <div style={{ marginTop: "40px" }}>Error fetching data</div>
        </AppError>

        <Body show={!!result}>
          <Card
            hostname="hola"
            appNameApdexs={[
              { name: "name oflkña lkd añld ald añld añldñ", apdex: 99 },
            ]}
          />
          <Card
            hostname="hola"
            appNameApdexs={[
              { name: "name oflkña lkd añld ald añld añldñ", apdex: 99 },
            ]}
          />
        </Body>
      </Layout>
    </div>
  );
}

export default App;
