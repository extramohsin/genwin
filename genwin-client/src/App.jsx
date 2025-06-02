import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WaitingRoom from "./pages/WaitingRoom";
import MatchResults from "./pages/MatchResults";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/Home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/waiting-room"
          element={
            <>
              <Navbar />
              <WaitingRoom />
            </>
          }
        />
        <Route
          path="/results"
          element={
            <>
              <Navbar />
              <MatchResults />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
