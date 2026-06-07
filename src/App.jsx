import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChooseRole from "./pages/ChooseRole";
import CreatorProfile from "./pages/CreatorProfile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/choose-role" element={<ChooseRole />} />

        <Route path="/creator-profile" element={<CreatorProfile />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;