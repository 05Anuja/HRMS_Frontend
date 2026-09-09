import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0d12]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
