
import { ReactNode } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Image, FileAudio, LayoutDashboard, Settings, User, LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { icon: <Image size={20} />, name: "Image to Text", path: "/dashboard/image" },
    { icon: <FileAudio size={20} />, name: "Audio to Text", path: "/dashboard/audio" },
    { icon: <LayoutDashboard size={20} />, name: "My Transcripts", path: "/dashboard/transcripts" },
    { icon: <User size={20} />, name: "Profile", path: "/dashboard/profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-secondary">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-sidebar p-4 md:p-6 md:h-screen">
        <div className="flex items-center justify-between mb-6">
          <NavLink to="/" className="text-2xl font-bold gradient-text">Textify</NavLink>
        </div>

        {/* Nav Links */}
        <div className="space-y-2 mb-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-textify-purple/20 text-textify-purple font-medium"
                    : "hover:bg-sidebar-accent hover:text-sidebar-primary"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="flex items-center gap-3 w-full justify-start hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
