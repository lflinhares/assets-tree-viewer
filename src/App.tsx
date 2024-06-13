import "./App.css";
import Header from "./components/header";
import TreeViewer from "./components/tree-viewer";

import { UnitProvider } from "./contexts/unitContext";

function App() {
  return (
    <UnitProvider>
      <Header />
      <TreeViewer />
    </UnitProvider>
  );
}

export default App;
