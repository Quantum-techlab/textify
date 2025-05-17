
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ImageToText from "./pages/dashboard/ImageToText";
import AudioToText from "./pages/dashboard/AudioToText";
import MyTranscripts from "./pages/dashboard/MyTranscripts";
import Profile from "./pages/dashboard/Profile";
import { AppContextProvider } from "./contexts/AppContext";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // For the demo, we'll use a simple state to mock authentication
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider value={{ isAuthenticated, login, logout }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<ImageToText />} />
                <Route path="image" element={<ImageToText />} />
                <Route path="audio" element={<AudioToText />} />
                <Route path="transcripts" element={<MyTranscripts />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppContextProvider>
    </QueryClientProvider>
  );
};

export default App;
