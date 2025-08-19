'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Menu, LogOut, Settings, User as UserIcon, ChevronFirst, ChevronLast } from 'lucide-react';

interface TopbarProps {
  onOpenSidebar: () => void; // mobile menu
  onToggleSidebar?: () => void; // desktop collapse/expand
  isSidebarCollapsed?: boolean; // desktop state
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
  currentCompany: {
    name: string;
  };
  handleLogout: () => Promise<void>;
  rounded?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({
  onOpenSidebar,
  onToggleSidebar,
  isSidebarCollapsed,
  currentUser,
  currentCompany,
  handleLogout,
  rounded,
}) => {
  return (
    <header className={`w-full flex items-center justify-between bg-white dark:bg-gray-800 shadow-md py-3 px-4 md:px-8 border-b border-lightGray dark:border-gray-700 z-20 transition-all duration-300
      ${rounded ? 'rounded-lg' : ''}`}>
      {/* Left: Mobile Sidebar Toggle & Desktop Collapse Button */}
      <div className="flex items-center space-x-3">
        {/* Mobile menu button */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg bg-lightGray dark:bg-gray-700 shadow-sm text-darkGray dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <Menu size={24} />
        </button>
        {/* Desktop collapse/expand button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden md:inline-flex p-2 rounded-lg bg-lightGray dark:bg-gray-700 shadow-sm text-darkGray dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? <ChevronLast size={22} /> : <ChevronFirst size={22} />}
          </button>
        )}
        <span className="text-2xl font-extrabold text-primary hidden md:inline select-none">
          Revl<span className="text-secondary">o</span>.
        </span>
        <span className="hidden md:inline text-mediumGray dark:text-gray-400 font-semibold ml-4">{currentCompany.name}</span>
      </div>

      {/* Right: Notifications, User Profile */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-lightGray dark:bg-gray-700 shadow-sm text-darkGray dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-redError rounded-full animate-pulse border border-white dark:border-gray-800"></span>
        </button>
        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-2 text-darkGray dark:text-gray-100 bg-lightGray dark:bg-gray-700 p-2 rounded-full shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">{currentUser.avatar}</span>
            <span className="hidden lg:block text-md">{currentUser.name}</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2 hidden group-hover:block z-50">
            <Link href={`/profile/${currentUser.id}`} className="block px-4 py-2 text-darkGray dark:text-gray-100 hover:bg-lightGray dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2">
              <UserIcon size={18} /> <span>Profile</span>
            </Link>
            <Link href="/settings" className="block px-4 py-2 text-darkGray dark:text-gray-100 hover:bg-lightGray dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2">
              <Settings size={18} /> <span>Settings</span>
            </Link>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-redError hover:bg-redError/10 transition-colors duration-200 flex items-center space-x-2">
              <LogOut size={18} /> <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;