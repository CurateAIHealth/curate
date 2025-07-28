'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Home,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { GetUserInformation } from '@/Lib/user.action';
import { useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [ProfileName, SetProfileName] = useState('');
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
    if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const Fetch = async () => {
      try {
        const localValue = localStorage.getItem('UserId');
    if (!localValue) {
    router.push("/");
        return;
    };

        const ProfileInformation = await GetUserInformation(localValue);
        SetProfileName(ProfileInformation.FirstName);
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
      }
    };
    Fetch();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('UserId');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      <aside
        className={`
          fixed z-30 inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
          bg-white shadow-lg
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
          ${isSidebarExpanded ? 'w-64' : 'w-20'}
        `}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-center p-4 border-b">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-gray-800"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-4 space-y-2">
              <SidebarLink
                href="/"
                icon={<Home />}
                label="Home"
                expanded={isSidebarExpanded}
              />
              <SidebarLink
                href="/profile"
                icon={<User />}
                label="Profile"
                expanded={isSidebarExpanded}
              />
              <SidebarLink
                href="/settings"
                icon={<Settings />}
                label="Settings"
                expanded={isSidebarExpanded}
              />
              <SidebarLink
                onClick={handleLogout}
                icon={<LogOut />}
                label="Logout"
                expanded={isSidebarExpanded}
              />
            </nav>
          </div>
        </div>
      </aside>

    
      <div className="flex flex-col flex-1 ml-0 md:ml-auto">
    
        <header className="bg-gray-100 shadow md:px-4 px-2 flex items-center justify-between" style={{ height: '7.5vh' }}>
      
          <div className="flex items-center space-x-4">
         
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

        
            <div className="hidden md:flex bg-white rounded-full pl-1 shadow-md w-[40px] h-[40px] items-center justify-center">
              <img
                src="/Icons/Curate-logo.png"
                alt="Curate AI Health Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>

    
          <div className="md:hidden bg-white rounded-full shadow-md w-[40px] h-[40px] flex items-center justify-center">
            <img
              src="/Icons/Curate-logo.png"
              alt="Curate AI Health Logo"
              className="w-6 h-6 object-contain"
            />
          </div>

       
          <div className="text-gray-600 hidden md:block">Welcome, {ProfileName}</div>
        </header>

      
        <main className="flex-1 overflow-y-auto px-2 py-3 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}


const SidebarLink = ({
  href,
  icon,
  label,
  expanded,
  onClick,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  onClick?: () => void;
}) => {
  const content = (
    <div className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-100 text-gray-700 transition group w-full">
      <span className="text-xl">{icon}</span>
      <span
        className={`transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0 hidden md:block'}`}
      >
        {label}
      </span>
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  ) : (
    <Link href={href!}>
      {content}
    </Link>
  );
};
