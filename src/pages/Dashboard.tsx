
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

  // Load Tesseract.js script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@2.1.1/dist/tesseract.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Don't render anything if not authenticated
  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;
