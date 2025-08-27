import React, { useState, useRef, useEffect } from "react";
import { Menu, UserCircle2, User, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = ({ onToggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm relative z-50">
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-blue-100/60 hover:bg-blue-200/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/80 transition-colors border border-transparent hover:border-blue-400"
        >
          <Menu className="w-6 h-6 text-blue-700 dark:text-blue-300" />
        </button>
        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 tracking-wide">Dashboard</h2>
      </div>
      {/* User */}
      <div className="flex items-center space-x-4">
        <DarkModeToggle />
        <span className="text-base font-medium text-blue-900 dark:text-blue-200">Admin</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="focus:outline-none"
          >
            <UserCircle2 className="w-9 h-9 text-blue-900 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg py-1 border border-zinc-200 dark:border-zinc-700 z-50">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-700"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
              <Link
                to="/login"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-700"
                onClick={() => setIsDropdownOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-zinc-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;