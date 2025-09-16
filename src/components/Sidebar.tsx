import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Truck,
  User,
  Upload,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminNavItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Candidates',
      href: '/admin/candidates',
      icon: Users,
    },
    {
      title: 'Jobs',
      href: '/admin/jobs',
      icon: Briefcase,
    },
    {
      title: 'Quiz Reviews',
      href: '/admin/quizzes',
      icon: Award,
    },
    {
      title: 'Documents',
      href: '/admin/documents',
      icon: FileText,
    },
  ];

  const candidateNavItems = [
    {
      title: 'Dashboard',
      href: '/candidate/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Profile',
      href: '/candidate/profile',
      icon: User,
    },
    {
      title: 'Quiz',
      href: '/candidate/quiz',
      icon: Award,
    },
    {
      title: 'Documents',
      href: '/candidate/documents',
      icon: Upload,
    },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : candidateNavItems;

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-brand-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">DriveVault</h1>
              <p className="text-xs text-gray-500">Recruit</p>
            </div>
          </div>
        )}
        <Button
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
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
              <User className="h-5 w-5 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.role === 'admin' ? 'Admin' : user?.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-brand-600 text-white hover:bg-brand-700"
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
      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start h-10 text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed ? "px-2" : "px-3"
          )}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};