import "./App.css";
import Header from "./components/header";

import { UnitProvider } from "./contexts/unitContext";
import Assets from "./screens/assets";

function App() {
  return (
    <UnitProvider>
      <Header />

      <Assets />
    </UnitProvider>
  );
}

export default App;
