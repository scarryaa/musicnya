import type { Component } from "solid-js";

import { Drawer } from "./components/Drawer/Drawer";
import { Titlebar } from "./components/Titlebar/Titlebar";
import { Main } from "./components/Main/Main";

const App: Component = () => {
  return (
    <div>
      <Titlebar />
      <Drawer />
      <Main />
    </div>
  );
};

export default App;
