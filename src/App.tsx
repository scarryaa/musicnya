import type { Component } from "solid-js";

import { Drawer } from "./components/Drawer/Drawer";
import { TopBar } from "./components/TopBar/TopBar";
import { Main } from "./components/Main/Main";

const App: Component = () => {
  return (
    <div>
      <TopBar />
      <Drawer />
      <Main />
    </div>
  );
};

export default App;
