import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  TreePine, 
  Bell, 
  Settings, 
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

const NavBar= () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="gis-nav h-14 px-4 flex items-center justify-between shadow-md z-50">
      <h1 className="text-xl font-semibold tracking-tight">
        Urban Dashboard
      </h1>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
              <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline">{user?.name || 'User'}</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
