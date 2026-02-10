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
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
                <img src="icons/avatar.jpg" alt="" className="w-6 h-6 rounded-full" />
              </div>
              <span className="hidden sm:inline">{user?.name || 'User'}</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2" onClick={() => navigate('/profile')}>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="gap-2">
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
