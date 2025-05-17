
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Google } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAppContext();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // For demo, just simulate a login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate credentials with a backend
      // For now, accept any non-empty email/password
      if (email && password) {
        login();
        toast({
          title: "Login successful",
          description: "Welcome back to Textify!",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please enter both email and password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    
    // For demo, simulate a login delay
    setTimeout(() => {
      login();
      toast({
        title: "Google login successful",
        description: "Welcome to Textify!",
      });
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to sign in to your account</p>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2" 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Google className="h-4 w-4" />
          Continue with Google
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="#" className="text-sm text-textify-purple hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-textify-purple hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
