import { NavLink } from "react-router-dom";

/* eslint-disable react/prop-types */
function Sidebar({ onMinimize }) {
  const userRole = localStorage.getItem("userRole") || "customer";

  return (
    <div className="w-64 bg-primary text-gray-100 flex flex-col h-full shadow-lg z-10 font-sans border-r border-gray-800">
      <div className="p-6 text-xl font-bold border-b border-white/10 tracking-tight flex items-center justify-between">
        <span className="flex items-center gap-3">Scaffoldz</span>
        <button
          onClick={onMinimize}
          className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors"
          title="Hide Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="9" x2="9" y1="3" y2="21" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-8 overflow-y-auto">

        {/* Customer Section - Only seen if NOT on /customer/dashboard (which hides sidebar) */}
        {userRole === "customer" && (

          <div className="p-4 bg-white/5 rounded-md border border-white/10 text-center">
            <p className="text-sm text-gray-300">Project View Active</p>
            <NavLink to="/customer/dashboard" className="text-accent text-xs font-bold hover:underline block mt-2">
              Back to Dashboard
            </NavLink>
          </div>
        )}

        {/* Contractor Section */}
        {userRole === "contractor" && (
          <div>
            <h3 className="text-xs uppercase text-accent/80 font-bold mb-3 px-3 tracking-widest">
              Contractor
            </h3>
            <div className="space-y-1">
              <NavLink to="/contractor/dashboard" className={({ isActive }) => `block px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${isActive ? "bg-accent text-primary shadow-sm" : "hover:bg-white/5 hover:text-white"}`}>
                Dashboard
              </NavLink>
              <NavLink to="/contractor/available-projects" className={({ isActive }) => `block px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${isActive ? "bg-accent text-primary shadow-sm" : "hover:bg-white/5 hover:text-white"}`}>
                Available Tenders
              </NavLink>
              <NavLink to="/contractor/my-bids" className={({ isActive }) => `block px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${isActive ? "bg-accent text-primary shadow-sm" : "hover:bg-white/5 hover:text-white"}`}>
                My Bids
              </NavLink>
            </div>
          </div>
        )}

        {/* Management Section */}
        {userRole === "management" && (
          <div>
            <h3 className="text-xs uppercase text-accent/80 font-bold mb-3 px-3 tracking-widest">
              Management
            </h3>
            <div className="space-y-1">
              <NavLink to="/management/dashboard" className={({ isActive }) => `block px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${isActive ? "bg-accent text-primary shadow-sm" : "hover:bg-white/5 hover:text-white"}`}>
                Dashboard
              </NavLink>
              <NavLink to="/management/quotations" className={({ isActive }) => `block px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${isActive ? "bg-accent text-primary shadow-sm" : "hover:bg-white/5 hover:text-white"}`}>
                Quotations
              </NavLink>
              <NavLink to="/management/analytics" className={({ isActive }) => `block px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${isActive ? "bg-accent text-primary shadow-sm" : "hover:bg-white/5 hover:text-white"}`}>
                Analytics
              </NavLink>
              <NavLink to="/management/users" className={({ isActive }) => `block px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${isActive ? "bg-accent text-primary shadow-sm" : "hover:bg-white/5 hover:text-white"}`}>
                Users
              </NavLink>
            </div>
          </div>
        )}

      </nav>

      <div className="p-4 border-t border-white/10 mx-4">
        <button
          onClick={() => {
            localStorage.removeItem("userRole");
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <span>🚪</span> Logout
        </button>
      </div>

      <div className="p-4 border-t border-white/10 mx-4 text-xs text-center text-white/40">
        &copy; 2026 Scaffoldz Inc.
      </div>
    </div>
  );
}

export default Sidebar;
