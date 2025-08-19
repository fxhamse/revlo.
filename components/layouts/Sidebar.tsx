'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Briefcase, DollarSign, Warehouse, Users, Truck, LineChart,
  Settings, X, UserCircle, LogOut,
  Landmark, UserCogIcon, Shield, BookOpen, Clock, Calendar, Menu
} from 'lucide-react';

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ReactNode;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ name, href, icon, isCollapsed, onClick }) => (
  <li>
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center text-lg py-2 px-3 rounded-md text-white hover:bg-primary/80 transition-all duration-300 group relative
                 ${isCollapsed ? 'justify-center' : 'justify-start'} space-x-3 animate-slide-in`}
    >
      <div className="text-2xl">
        {React.cloneElement(icon as React.ReactElement, { className: 'text-white group-hover:text-secondary dark:group-hover:text-secondary transition-colors duration-200' })}
      </div>
      {/* Tooltip on hover when collapsed */}
      {isCollapsed ? (
        <span className="opacity-0 absolute left-full ml-4 w-auto bg-darkGray text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap invisible group-hover:visible group-hover:opacity-100 z-50">
          {name}
        </span>
      ) : (
        <span className="truncate transition-all duration-300">{name}</span>
      )}
    </Link>
  </li>
);

interface SidebarProps {
  setIsSidebarOpen?: (isOpen: boolean) => void;
  isCollapsed: boolean;
  currentTime: Date;
  currentUser: { name: string; email: string; avatar: string; id: string; role: string; } | null;
  currentCompany: { name: string; };
  handleLogout: () => Promise<void>;
  onNavItemClick?: () => void;
}

const menuConfig = {
  ADMIN: [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
    { name: 'Projects', href: '/projects', icon: <Briefcase /> },
    { name: 'Customers', href: '/customers', icon: <Users /> },
    { name: 'Employees', href: '/employees', icon: <UserCogIcon /> },
    { name: 'Expenses', href: '/expenses', icon: <DollarSign /> },
    { name: 'Accounting', href: '/accounting', icon: <Landmark /> },
    { name: 'Inventory', href: '/inventory', icon: <Warehouse /> },
    { name: 'Vendors', href: '/vendors', icon: <Truck /> },
    { name: 'Reports', href: '/reports', icon: <LineChart /> },
    { name: 'Users', href: '/settings/users', icon: <Shield /> },
    { name: 'Docs', href: '/docs', icon: <BookOpen /> },
  ],
  MANAGER: [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
    { name: 'Projects', href: '/projects', icon: <Briefcase /> },
    { name: 'Customers', href: '/customers', icon: <Users /> },
    { name: 'Employees', href: '/employees', icon: <UserCogIcon /> },
    { name: 'Expenses', href: '/expenses', icon: <DollarSign /> },
    { name: 'Accounting', href: '/accounting', icon: <Landmark /> },
    { name: 'Inventory', href: '/inventory', icon: <Warehouse /> },
    { name: 'Vendors', href: '/vendors', icon: <Truck /> },
    { name: 'Reports', href: '/reports', icon: <LineChart /> },
    { name: 'Docs', href: '/docs', icon: <BookOpen /> },
  ],
  MEMBER: [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
    { name: 'Projects', href: '/projects', icon: <Briefcase /> },
    { name: 'Expenses', href: '/expenses', icon: <DollarSign /> },
    { name: 'Inventory', href: '/inventory', icon: <Warehouse /> },
    { name: 'Docs', href: '/docs', icon: <BookOpen /> },
  ],
  VIEWER: [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
    { name: 'Projects', href: '/projects', icon: <Briefcase /> },
    { name: 'Docs', href: '/docs', icon: <BookOpen /> },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({
  setIsSidebarOpen,
  isCollapsed,
  currentTime,
  currentUser,
  currentCompany,
  handleLogout,
  onNavItemClick,
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto close sidebar on mobile nav click
  const handleNavClick = () => {
    if (isMobile) setMobileOpen(false);
    if (onNavItemClick) onNavItemClick();
  };

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const role = currentUser?.role?.toUpperCase() as keyof typeof menuConfig;
  const navItems = menuConfig[role] || menuConfig['VIEWER'];

  const bottomItems = [
    { name: 'Settings', href: '/settings', icon: <Settings /> },
    { name: 'Log Out', href: '#', icon: <LogOut />, onClick: handleLogout },
  ];

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Mobile sidebar overlay
  if (isMobile) {
    return (
      <>
        {/* Hamburger menu (logo hidden when sidebar closed) */}
        {!mobileOpen && (
          <button
            className="fixed top-4 left-4 z-50 p-2 rounded-md bg-darkGray text-white shadow-lg md:hidden flex items-center"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={28} />
          </button>
        )}
        {/* Sidebar Drawer */}
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible pointer-events-none'}`}
        >
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar */}
          <aside
            className={`
              h-full bg-darkGray dark:bg-gray-900 text-white flex flex-col shadow-xl
              w-60 transition-transform duration-300 ease-in-out
              rounded-tr-sm rounded-br-sm
              fixed top-0 left-0 z-50 border-r border-gray-800
              ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            style={{
              minWidth: 240,
              maxWidth: 240,
              borderTopRightRadius: '0.2rem',
              borderBottomRightRadius: '0.2rem',
              background: 'linear-gradient(135deg, #233047 80%, #1e293b 100%)',
            }}
          >
            {/* Top: Logo, Close Button */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <span className="text-3xl font-extrabold tracking-wide select-none">
                Revl<span className="text-secondary">o</span>.
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>
            {/* User Profile & Company Info */}
            {currentUser && (
              <Link href={`/profile/${currentUser.id}`} className="group flex items-center p-3 rounded-md text-white hover:bg-primary/80 transition-all duration-300 mb-4">
                <div className="rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg w-12 h-12 text-2xl border-2 border-primary/50 shadow-md flex-shrink-0">
                  {currentUser.avatar}
                </div>
                <div className="text-left flex-1 animate-fade-in ml-3">
                  <h3 className="text-base font-bold text-white leading-tight">{currentUser.name}</h3>
                  <p className="text-xs text-mediumGray dark:text-gray-400 leading-tight">{currentCompany.name}</p>
                  <p className="text-xs text-mediumGray dark:text-gray-400 leading-tight">Role: {currentUser.role}</p>
                </div>
              </Link>
            )}
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-1 custom-scrollbar">
              <ul className="space-y-1 pb-8">
                {navItems.map((item) => (
                  <NavItem
                    key={item.name}
                    {...item}
                    isCollapsed={false}
                    onClick={handleNavClick}
                  />
                ))}
                {currentUser && (
                  <NavItem
                    name="Profile"
                    href={`/profile/${currentUser.id}`}
                    icon={<UserCircle />}
                    isCollapsed={false}
                    onClick={handleNavClick}
                  />
                )}
              </ul>
            </nav>
            {/* Bottom: Clock, Settings, Logout */}
            <div className="px-2 pb-4 border-t border-gray-700 bg-darkGray/90 dark:bg-gray-900/90">
              <div className="my-3 flex flex-col items-center">
                <span className="text-xl font-extrabold text-white flex items-center animate-pulse">
                  <span className="mr-2"><Clock size={18} className="text-secondary" /></span>
                  {formatTime(currentTime)}
                </span>
                <span className="text-xs text-mediumGray dark:text-gray-400 flex items-center mt-1">
                  <Calendar size={14} className="mr-1 text-primary" /> {formatDate(currentTime)}
                </span>
              </div>
              <ul className="space-y-1">
                {bottomItems.map((item) =>
                  item.name === 'Log Out' ? (
                    <li key={item.name}>
                      <button
                        onClick={item.onClick}
                        className="w-full flex items-center text-lg py-2 px-3 rounded-md text-redError hover:bg-redError/10 transition-colors duration-300 group relative justify-start space-x-3 animate-slide-in"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="truncate transition-all duration-300">{item.name}</span>
                      </button>
                    </li>
                  ) : (
                    <NavItem
                      key={item.name}
                      {...item}
                      isCollapsed={false}
                      onClick={handleNavClick}
                    />
                  )
                )}
              </ul>
            </div>
          </aside>
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <aside
      className={`
        h-full bg-darkGray dark:bg-gray-900 text-white flex flex-col shadow-xl
        ${collapsed ? 'w-16' : 'w-60'}
        transition-all duration-300 ease-in-out
        rounded-tr-sm rounded-br-sm
        fixed md:static top-0 left-0 z-40
        border-r border-gray-800
      `}
      style={{
        minWidth: collapsed ? 64 : 240,
        maxWidth: collapsed ? 64 : 240,
        borderTopRightRadius: '0.2rem',
        borderBottomRightRadius: '0.2rem',
        background: 'linear-gradient(135deg, #233047 80%, #1e293b 100%)',
      }}
    >
      {/* Top: Logo only (collapse button waa in laga saaraa oo Topbar laga xakameeyaa) */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-700">
        <span className="text-3xl font-extrabold tracking-wide select-none">
          {collapsed ? <>R<span className="text-secondary">.</span></> : <>Revl<span className="text-secondary">o</span>.</>}
        </span>
      </div>

      {/* User Profile & Company Info */}
      {!collapsed && currentUser && (
        <Link href={`/profile/${currentUser.id}`} className="group flex items-center p-3 rounded-md text-white hover:bg-primary/80 transition-all duration-300 mb-4">
          <div className="rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg w-12 h-12 text-2xl border-2 border-primary/50 shadow-md flex-shrink-0">
            {currentUser.avatar}
          </div>
          <div className="text-left flex-1 animate-fade-in ml-3">
            <h3 className="text-base font-bold text-white leading-tight">{currentUser.name}</h3>
            <p className="text-xs text-mediumGray dark:text-gray-400 leading-tight">{currentCompany.name}</p>
            <p className="text-xs text-mediumGray dark:text-gray-400 leading-tight">Role: {currentUser.role}</p>
          </div>
        </Link>
      )}

      {/* Navigation (scrollable) */}
      <nav className="flex-1 overflow-y-auto px-1 sidebar-scrollbar">
        <ul className="space-y-1 pb-8">
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              {...item}
              isCollapsed={collapsed}
              onClick={onNavItemClick}
            />
          ))}
          {currentUser && (
            <NavItem
              name="Profile"
              href={`/profile/${currentUser.id}`}
              icon={<UserCircle />}
              isCollapsed={collapsed}
              onClick={onNavItemClick}
            />
          )}
        </ul>
      </nav>

      {/* Bottom: Clock, Settings, Logout */}
      {!collapsed && (
        <div className="px-2 pb-4 border-t border-gray-700 bg-darkGray/90 dark:bg-gray-900/90">
          <div className="my-3 flex flex-col items-center">
            <span className="text-xl font-extrabold text-white flex items-center animate-pulse">
              <span className="mr-2"><Clock size={18} className="text-secondary" /></span>
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-mediumGray dark:text-gray-400 flex items-center mt-1">
              <Calendar size={14} className="mr-1 text-primary" /> {formatDate(currentTime)}
            </span>
          </div>
          <ul className="space-y-1">
            {bottomItems.map((item) =>
              item.name === 'Log Out' ? (
                <li key={item.name}>
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center text-lg py-2 px-3 rounded-md text-redError hover:bg-redError/10 transition-colors duration-300 group relative justify-start space-x-3 animate-slide-in"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="truncate transition-all duration-300">{item.name}</span>
                  </button>
                </li>
              ) : (
                <NavItem
                  key={item.name}
                  {...item}
                  isCollapsed={collapsed}
                  onClick={onNavItemClick}
                />
              )
            )}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;