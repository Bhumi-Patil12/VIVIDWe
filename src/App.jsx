import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChooseRole from "./pages/ChooseRole";
import CreatorProfile from "./pages/CreatorProfile";
import RecruiterProfile from "./pages/RecruiterProfile"; // नया Recruiter पेज इम्पोर्ट किया
import ViewerProfile from "./pages/ViewerProfile";       // नया Viewer पेज इम्पोर्ट किया
import Reels from "./pages/Reels";
import ReelFeed from './pages/ReelFeed';
import DashboardWrapper from "./pages/DashboardWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        
       <Route path="/dashboard" element={<DashboardWrapper />} />
        
        {/* Teeno roles ke profiles */}
        <Route path="/creator-profile" element={<CreatorProfile />} />
        <Route path="/recruiter-profile" element={<RecruiterProfile />} />
        <Route path="/viewer-profile" element={<ViewerProfile />} />
        
        <Route path="/reels" element={<Reels />} />
        <Route path="/reels/feed" element={<ReelFeed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;