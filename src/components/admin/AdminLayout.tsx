
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout: React.FC = () => {
  const { isAuthenticated, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else if (location.pathname === '/admin/aprovacoes') {
      // Check if user is admin to access approvals page
      // This is a simple check. In a real app, you might have a more robust role system
      if (user?.email !== 'admin@jurisquick.com') {
        navigate("/admin/dashboard");
      }
    }
  }, [isAuthenticated, navigate, location.pathname, user]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
