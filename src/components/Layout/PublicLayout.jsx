import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="custom-scrollbar" style={{ height: '100%', overflowY: 'auto', background: '#f7f9fb' }}>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
