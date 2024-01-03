import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Stations from "./pages/Stations";
import Login from "./pages/Login";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" Component={Login} />
      <Route path="/map" Component={Stations} />
    </Routes>
    <Footer />
  </Router>
);

export default App;
