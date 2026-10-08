import { useState } from "react";
import Home from "./pages/home.jsx";
import Loader from "./components/Loader.jsx";
import Nav from "./components/Nav.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Nav />
      <Home />
    </>
  )
}

export default App;
