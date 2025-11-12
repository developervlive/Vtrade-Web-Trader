import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";

//import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import Dashboard from "./pages/Demo";

//import Dashboard from "./pages/Demo2";
//ALPHA_VANTAGE_KEY=A4P5ZW4DTKF4D00Q

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
