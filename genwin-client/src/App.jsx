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
        <Route path="/" element={<Login />} />  {/* Redirect to Login for now */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/register" element={<Register />} /> {/* Duplicate for safety */}
        <Route path="/waiting-room" element={<WaitingRoom />} />
        <Route path="/results" element={<MatchResults />} />
      </Routes>
    </Router>
  );
};

export default App;
