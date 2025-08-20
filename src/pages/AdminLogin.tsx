import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = login(username, password);
      if (success) {
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Incorrect credentials");
      }
    } catch (error) {
      toast.error("Login error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <BackgroundAnimation />

      <div className="relative z-10 w-full max-w-md">
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm shadow-2xl shadow-red-500/10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">
                Administration
              </CardTitle>
              <CardDescription className="text-gray-300">
                Secure access to admin panel
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Lock className="w-4 h-4 mr-2 animate-pulse" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                onClick={() => navigate("/")}
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
