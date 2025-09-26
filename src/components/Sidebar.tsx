import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard,
  Briefcase,
  User,
  Award,
  Upload,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Truck,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const adminNavItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { title: "Quiz Management", href: "/admin/quiz", icon: Award },
    { title: "Documents", href: "/admin/documents", icon: Upload },
  ];

  const candidateNavItems = [
    { title: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
    { title: "Profile", href: "/candidate/profile", icon: User },
    { title: "Documents", href: "/candidate/documents", icon: Upload },
    { title: "Quiz", href: "/candidate/quiz", icon: Award },
    { title: "Practice", href: "/candidate/practice", icon: Award },
  ];

  const welderNavItems = [
    { title: "Dashboard", href: "/welder/dashboard", icon: LayoutDashboard },
    { title: "Profile", href: "/welder/profile", icon: User },
    { title: "Documents", href: "/welder/documents", icon: Upload },
    { title: "Quiz", href: "/welder/quiz", icon: Award },
    { title: "Practice", href: "/welder/practice", icon: Award },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : 
                   user?.role === "welder" ? welderNavItems : candidateNavItems;

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-border fixed top-0 left-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-brand-600" />
            <div>
              <h1 className="text-lg font-bold text-secondary-foreground">
                DriveVault
              </h1>
              <p className="text-xs text-primary-foreground">Recruit</p>
            </div>
          </div>
        )}
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button> */}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-secondary-foreground truncate">
                {user?.role === "admin" ? "Admin" : user?.email}
              </p>
              <p className="text-xs text-primary-foreground capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 p-0 m-0">
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 mt-1 px-4 hover:border border-ring bg-baground ",
                    isActive
                      ? "bg-primary text-secondary cursor-pointer"
                      : "text-primary-foreground hover:bg-accent hover:text-secondary-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border mt-auto">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={cn(
            "w-full justify-start h-10 mb-2 m-0 px-4",
            "text-secondary-foreground"
          )}
        >
          {theme === "light" ? (
            <Moon className={cn("h-4 w-4", !collapsed && "mr-3")} />
          ) : (
            <Sun className={cn("h-4 w-4", !collapsed && "mr-3")} />
          )}
          {!collapsed && (
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start h-10 m-0 px-4",
            "text-red-600 hover:text-red-700"
          )}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};
