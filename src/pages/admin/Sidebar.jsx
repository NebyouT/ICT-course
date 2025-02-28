import { ChartNoAxesColumn, Menu, SquareLibrary, TestTube2, X } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => currentPath === path;

  const NavLinks = () => (
    <nav className="space-y-1">
      <Link
        to="dashboard"
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive("dashboard")
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
            : "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200"
        }`}
      >
        <ChartNoAxesColumn size={20} />
        <span className="font-medium">Dashboard</span>
      </Link>

      <Link
        to="course"
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive("course")
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
            : "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200"
        }`}
      >
        <SquareLibrary size={20} />
        <span className="font-medium">Courses</span>
      </Link>

      <Link
        to="test"
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive("test")
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
            : "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200"
        }`}
      >
        <TestTube2 size={20} />
        <span className="font-medium">Tests</span>
      </Link>
    </nav>
  );
  
  return (
    <div className="flex pt-16"> 
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[250px] sm:w-[300px] transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:block backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-purple-100 dark:border-purple-900/20 p-5 h-[calc(100vh-4rem)] mt-16 lg:mt-0 overflow-y-auto`}
      >
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div className="relative aspect-[1155/678] w-[36.125rem] bg-gradient-to-br from-[#80E9FF] via-[#E264FF] to-[#794AFF] opacity-30"></div>
          </div>

          {/* Logo/Title */}
          <div className="flex items-center gap-2 px-2 py-4 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>

          {/* Navigation Links */}
          <NavLinks />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative min-h-screen bg-gradient-to-br from-white via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900 lg:ml-0">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e9d5ff_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#4c1d95_100%)]"></div>
        <div className="p-4 sm:p-8 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
