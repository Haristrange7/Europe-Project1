import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}


export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Animate content on mount
    gsap.fromTo(
      ".main-content",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <ThemeProvider>
      <div className="flex bg-background min-h-screen">
        {isAuthenticated && <Sidebar />}
        <div
          className={cn(
            "flex-1 flex flex-col",
            isAuthenticated ? "ml-64" : "ml-0"
          )}
        >
          {/* Header */}
          {title && (
            <header className="bg-header border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-primary-foreground ">
                    {title}
                  </h1>
                  <div className="h-0.5 w-20 bg-primary-foreground rounded-full mt-2"></div>
                </div>
              </div>
            </header>
          )}
          {/* Main Content */}
          <main className="main-content flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};
