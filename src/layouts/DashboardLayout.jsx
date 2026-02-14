import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  const location = useLocation();
  // REQUIREMENT: NO SIDEBAR for customers (to avoid double sidebar in project view)
  // Check local storage for role since location check isn't enough
  const userRole = localStorage.getItem("userRole");
  const isCustomer = userRole === "customer";

  return (
    <div className="flex h-screen bg-background text-gray-800 font-sans">
      {/* Sidebar - Conditionally Rendered */}
      {!isCustomer && <Sidebar />}

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto ${isCustomer ? 'w-full' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
