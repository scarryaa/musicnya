/* @refresh reload */
import { render } from "solid-js/web";

import "./index.scss";
import App from "./App";
import { Route, Router, Routes } from "@solidjs/router";
import { Home } from "./pages/Home/Home";
import { Browse } from "./pages/Browse/Browse";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={App}>
          <Route path="/home" component={Home} />
          <Route path="/browse" component={Browse} />
        </Route>
      </Routes>
    </Router>
  ),
  root!,
);
