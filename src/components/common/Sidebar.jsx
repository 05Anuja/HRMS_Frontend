import {
  LayoutDashboard,
  Users,
  Dog,
  CalendarCheck,
  UserCog,
  ClipboardList,
  BadgeDollarSign,
  ChartBar,
  PawPrint,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeftToLine,
  ArrowRightToLine,
  PanelRightOpen,
  PanelRightClose,
  Sparkle,
} from "lucide-react";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../assets/Silgate_Solutions_Logo.svg";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "hr"],
  },
  {
    id: "candidates",
    icon: Users,
    label: "Candidates",
    path: "/candidates",
    roles: ["admin", "hr"],
  },
  {
    id: "history",
    icon: ClipboardList,
    label: "Candidate History",
    path: "/candidate-history",
    roles: ["admin", "hr"],
  },
  {
    id: "users",
    icon: UserCog,
    label: "HR Management",
    path: "/users",
    roles: ["admin"],
  },
];

import { useAuth } from "../../context/authcontext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item =>
    !item.roles || item.roles.includes(user?.role)
  );

  const [collapsed, setCollapsed] = useState(false);

  // const isActive = (path) => location.pathname.startsWith(path);
  const isActive = (path) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/" || location.pathname.startsWith("/dashboard")
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`group relative min-h-screen bg-[#E2E2E2] dark:bg-zinc-900 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-20 2xl:w-24" : "w-56 2xl:w-64"}`}
    >
      {/* TOGGLE BUTTON (Hidden until hover when collapsed) */}
      <div className="relative group">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`peer absolute -right-3 top-6 z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-full p-1.5 transition-all duration-300 ${collapsed
              ? "opacity-0 group-hover:opacity-100 cursor-e-resize"
              : "opacity-100 cursor-w-resize"
            }`}
        >
          {collapsed ? (
            <PanelRightClose size={16} />
          ) : (
            <PanelRightOpen size={16} />
          )}
        </button>
        {/* Tooltip */}
        <span className="z-50 absolute -right-10 top-17 whitespace-nowrap bg-black text-white text-xs px-2 py-2 rounded opacity-0 peer-hover:opacity-100 transition">
          {collapsed ? "Open sidebar" : "Close sidebar"}
        </span>
      </div>

      {/* LOGO */}
      <div className="px-4 py-4 flex items-center justify-center border-b border-zinc-200/50 dark:border-zinc-800/50 mb-4">
        <div
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer flex items-center justify-center"
        >
          <img
            src={logoImg}
            alt="Silgate"
            className={`${collapsed ? "h-6" : "h-9"} object-contain transition-all duration-300`}
          />
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-2 space-y-1">
        {filteredMenuItems.map((item) => {
          const isItemActive = isActive(item.path);

          return (
            <div key={item.id} className="relative group/item">
              {/* ACTIVE INDICATOR */}
              {isItemActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-zinc-950 dark:bg-white transition-all duration-300" />
              )}

              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-2 rounded-md text-xs transition-all cursor-pointer
                  ${collapsed ? "justify-center" : ""}
                  ${isItemActive
                    ? "text-zinc-950 dark:text-white font-bold bg-zinc-200/60 dark:bg-zinc-800"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-855/50"
                  }
                `}
              >
                <item.icon
                  strokeWidth={2.5}
                  className={`w-4 h-4 ${collapsed ? "" : "mr-3"} 
                  ${isItemActive ? "text-zinc-950 dark:text-white" : "text-zinc-500"}`}
                />

                {!collapsed && (
                  <span className="text-xs font-semibold">{item.label}</span>
                )}
              </button>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute z-999 left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover/item:block bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* UPGRADE PLAN - BOTTOM */}
      {/* {!collapsed && (
        <div className="px-2 pb-3 mt-3">
          <button
            onClick={() => navigate("/pricing")}
            className={`w-full flex items-center px-4 py-2 rounded-md text-xs transition-all cursor-pointer
      ${collapsed ? "justify-center" : ""}
      text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50
    `}
          >
            <Sparkle
              strokeWidth={2.5}
              className={`w-4 h-4 ${collapsed ? "" : "mr-3"} text-zinc-500`}
            />
            <span className="text-xs font-semibold">Upgrade Plan</span>
          </button>
        </div>
      )} */}
    </aside>
  );
};

export default Sidebar;
