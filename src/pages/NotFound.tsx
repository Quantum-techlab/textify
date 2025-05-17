
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <h1 className="text-8xl font-bold gradient-text">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-lg text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate("/")}
          className="bg-textify-purple hover:bg-textify-purple-dark"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
