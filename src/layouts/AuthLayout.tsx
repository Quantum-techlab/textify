
import { Outlet } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <header className="py-4 px-6 bg-white shadow-sm">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold gradient-text">Textify</span>
        </NavLink>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardContent className="pt-6">
            <Outlet />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuthLayout;
