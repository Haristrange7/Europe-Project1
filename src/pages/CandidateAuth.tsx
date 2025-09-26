import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ArrowLeft, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import gsap from "gsap";
import { useTheme } from "@/contexts/ThemeContext";

export const CandidateAuth: React.FC = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const prevTab = React.useRef<"login" | "register">(activeTab);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/candidate/dashboard");
      return;
    }
    gsap.fromTo(
      ".auth-card",
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
    );
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Animate tab content directionally
    const fromX =
      prevTab.current === "login" && activeTab === "register" ? 80 : -80;
    const toX =
      prevTab.current === "login" && activeTab === "register" ? -80 : 80;
    gsap.fromTo(
      ".tab-content",
      { x: fromX, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.38, ease: "power2.out" }
    );
    prevTab.current = activeTab;
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(
        loginData.email,
        loginData.password,
        "candidate"
      );
      if (success) {
        toast.success("Welcome back!");
        navigate("/candidate/dashboard");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const success = await register(
        registerData.email,
        registerData.password,
        registerData.phone
      );
      if (success) {
        toast.success("Registration successful! You can now log in.");
        setRegisterData({
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        // Switch to login tab
        const loginTab = document.querySelector(
          '[value="login"]'
        ) as HTMLButtonElement;
        loginTab?.click();
      } else {
        toast.error("Registration failed. Email or phone may already exist.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <Card className="auth-card w-full max-w-md relative overflow-hidden">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <CardHeader className="text-center space-y-2">
          <Users className="h-16 w-16 mx-auto text-primary" />
          <CardTitle className="text-2xl font-bold">Driver Portal</CardTitle>
          <CardDescription>
            Login to your account or register as a new driver
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger value="login" className="cursor-pointer">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="cursor-pointer">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 tab-content">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="Enter email or phone number"
                    className=" placeholder:text-muted-foreground placeholder:text-10px"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className=" placeholder:text-muted-foreground placeholder:text-10px"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 tab-content">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    className=" placeholder:text-muted-foreground placeholder:text-10px"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-phone">
                    Phone Number
                  </Label>
                  <Input
                    id="register-phone"
                    className="placeholder:text-muted-foreground placeholder:text-10px"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)"
                    className="placeholder:text-muted-foreground placeholder:text-10px"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="placeholder:text-muted-foreground placeholder:text-10px"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
