import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Route, Routes } from "react-router-dom";
import NavigationComponent from "./components/navigation/navigationcomponent";
import LearningComponent from "./components/learningcomponent/learningcomponent";
import ExportComponent from "./components/exportcomponent/exportcomponent";
import ImportComponent from "./components/importcomponent/importcomponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

root.render(
  <HashRouter>
    <Routes>
      <Route exact path="/" element={<App key="app" />} />
      <Route
        exact
        path="/learning"
        element={[
          <NavigationComponent key="nav" />,
          <LearningComponent key="learning" />,
        ]}
      />

      <Route
        exact
        path="/export"
        element={[
          <NavigationComponent key="nav" />,
          <ExportComponent key="export" />,
        ]}
      />
      <Route
        exact
        path="/import"
        element={[
          <NavigationComponent key="nav" />,
          <ImportComponent key="import" />,
        ]}
      />
    </Routes>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
