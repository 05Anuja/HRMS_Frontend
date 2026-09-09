import {
  Bell,
  ChevronDown,
  Filter,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkle,
  Sun,
  UserPen,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Axios from "../../utils/axiosConfig";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";

const Header = ({ sideBarCollapsed, onToggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState("");
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await Axios.get("/auth/me");
      setUserData(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-zinc-200/60 dark:border-zinc-800/80 px-6 py-3 relative z-50 transition-colors duration-300">
      <div className="flex items-center justify-end gap-5">


        {/* Right side controls */}
        <div className="flex items-center space-x-4">

          {/* Profile Dropdown */}
          <div className="relative">
            {/* Trigger */}
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2.5 pl-4 border-l border-zinc-250/60 dark:border-zinc-800/80 cursor-pointer select-none px-1"
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full border border-zinc-250 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-xs font-bold flex items-center justify-center text-zinc-850 dark:text-zinc-200 uppercase shadow-sm">
                {userData?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* Name + Role */}
              <div className="hidden md:block text-left min-w-0">
                <p className="text-xs font-bold text-zinc-850 dark:text-zinc-100 truncate leading-none">
                  {userData?.name
                    ? userData.name.charAt(0).toUpperCase() +
                    userData.name.slice(1)
                    : "User"}
                </p>

                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5 leading-none">
                  {userData?.role || "Member"}
                </p>
              </div>

              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2.5 w-52 rounded-xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-lg border border-zinc-200/80 dark:border-zinc-800/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Header */}
                <div className="text-center px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-955/50">
                  <div className="w-9 h-9 mx-auto mb-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200 uppercase shadow-sm">
                    {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate">
                    {userData?.name || "User"}
                  </p>

                  <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mt-0.5">
                    {userData?.role?.toLowerCase()}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="p-1.5 space-y-0.5">
                  {/* <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-150/70 dark:hover:bg-zinc-900/70 text-zinc-700 dark:text-zinc-300 transition-colors text-left"
                  >
                    <UserPen className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Update Profile
                  </button> */}

                  {/* <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/pricing");
                    }}
                    className="w-full flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-150/70 dark:hover:bg-zinc-900/70 text-zinc-700 dark:text-zinc-300 transition-colors text-left"
                  >
                    <Sparkle className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Upgrade Plan
                  </button> */}

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg text-red-655 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
