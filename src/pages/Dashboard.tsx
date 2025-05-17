
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

  // Load Tesseract.js script and worker
  useEffect(() => {
    const loadScript = async () => {
      try {
        // Remove any existing script to avoid duplicates
        const existingScript = document.querySelector('script[src*="tesseract.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }

        // Create and add the script element
        const script = document.createElement("script");
        script.src = "https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js";
        script.async = true;
        script.onload = () => console.log("Tesseract.js script loaded successfully!");
        script.onerror = (e) => console.error("Error loading Tesseract.js script:", e);
        
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error in script loading process:", error);
      }
    };

    loadScript();

    return () => {
      // Clean up script when component unmounts
      const script = document.querySelector('script[src*="tesseract.js"]');
      if (script && document.body.contains(script)) {
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
