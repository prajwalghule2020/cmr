"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Map,
  FileText,
  LogOut,
  Activity
} from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { path: '/dashboard', label: 'Skill Trends', icon: BarChart3 },
    { path: '/roadmap', label: 'Career Roadmap', icon: Map },
    { path: '/explainability', label: 'Explainability', icon: FileText },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            <span className="font-semibold text-foreground">SkillIntel</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.path)
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-foreground">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.currentRole}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
