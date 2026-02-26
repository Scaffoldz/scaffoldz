import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  // REQUIREMENT: NO SIDEBAR for customers (to avoid double sidebar in project view)
  // Check local storage for role since location check isn't enough
  const userRole = localStorage.getItem("userRole");
  const isCustomer = userRole === "customer";

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="flex h-screen bg-background text-gray-800 font-sans relative overflow-hidden">
      {/* Sidebar - Always rendered but width changes */}
      {!isCustomer && (
        <div
          className={`transition-all duration-300 ease-in-out ${isSidebarVisible ? 'w-64' : 'w-0'} h-full overflow-hidden shrink-0`}
        >
          <Sidebar onMinimize={() => setIsSidebarVisible(false)} />
        </div>
      )}

      {/* Restore Sidebar Button (Floating) */}
      {!isCustomer && !isSidebarVisible && (
        <button
          onClick={() => setIsSidebarVisible(true)}
          className="fixed bottom-6 left-6 z-50 bg-primary text-white p-3 rounded-full shadow-xl hover:bg-primary/90 transition-all border border-white/10 hover:scale-110 active:scale-95 animate-bounce-subtle"
          title="Show Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="9" x2="9" y1="3" y2="21" />
          </svg>
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
