import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

// Layout
import ModernSidebar from "./components/ModernSidebar";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute"; // ✅ import it

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword"; 
import Dashboard from "./pages/Dashboard";
import BackgroundCarousel from "./pages/BackgroundCarousel";
import StoreLinks from "./pages/StoreLinks";
import SocialLinks from "./pages/SocialLinks";
import NavbarButtons from "./pages/NavbarButtons";
import Reviews from "./pages/Reviews";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex min-h-screen bg-white/70 dark:bg-zinc-900/80 transition-colors duration-300">
      {!isAuthPage && isSidebarOpen && <ModernSidebar />}
      <div className="flex-1 flex flex-col">
        {!isAuthPage && <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
        <ToastContainer />

        <Routes>
          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Main app pages - protected */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/bgcarousel" element={<PrivateRoute><BackgroundCarousel /></PrivateRoute>} />
          <Route path="/storelinks" element={<PrivateRoute><StoreLinks /></PrivateRoute>} />
          <Route path="/sociallinks" element={<PrivateRoute><SocialLinks /></PrivateRoute>} />
          <Route path="/navbarbuttons" element={<PrivateRoute><NavbarButtons /></PrivateRoute>} />
          <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />

          {/* Catch invalid routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
