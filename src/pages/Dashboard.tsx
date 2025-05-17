
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import DashboardLayout from "@/layouts/DashboardLayout";

const Dashboard = () => {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  // Simple auth guard - in a real app, you'd use a more robust solution
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;
