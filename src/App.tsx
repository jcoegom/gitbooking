import React from "react";
import "./App.css";

import Layout from "./components/common/Layout/Layout";
import Card from "./components/appsbyhost/card/Card";
import Header from "./components/appsbyhost/header/Header";
import CheckBox from "./components/common/checkbox/CheckBox";
import Separator from "./components/common/checkbox/separator/Separator";
import Body from "./components/appsbyhost/body/Body";

function App() {
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
        <Body>
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
