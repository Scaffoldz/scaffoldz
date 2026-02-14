import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-72 bg-primary text-gray-100 flex flex-col h-full shadow-2xl z-10 font-sans">
      <div className="p-6 text-3xl font-bold border-b border-white/10 tracking-wide flex items-center gap-3">
        <span className="text-accent text-4xl">🏗️</span> Scaffoldz
      </div>

      <nav className="flex-1 p-4 space-y-8 overflow-y-auto">

        {/* Customer Section */}
        <div>
          <h3 className="text-xs uppercase text-accent/80 font-bold mb-3 px-3 tracking-widest">
            Customer
          </h3>
          <div className="space-y-1">
            <NavLink to="/customer/dashboard" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/project-status" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>📂</span> My Projects
            </NavLink>
            <NavLink to="/submit-project" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>➕</span> Submit Project
            </NavLink>
            <NavLink to="/payment" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>💳</span> Payments
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>📑</span> Reports
            </NavLink>
          </div>
        </div>

        {/* Contractor Section */}
        <div>
          <h3 className="text-xs uppercase text-accent/80 font-bold mb-3 px-3 tracking-widest">
            Contractor
          </h3>
          <div className="space-y-1">
            <NavLink to="/contractor/dashboard" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>👷</span> Dashboard
            </NavLink>
            <NavLink to="/open-projects" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>🔍</span> Available Projects
            </NavLink>
            <NavLink to="/my-bids" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>🔖</span> My Bids
            </NavLink>
            <NavLink to="/contractor-reports" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>📋</span> Reports
            </NavLink>
          </div>
        </div>

        {/* Management Section */}
        <div>
          <h3 className="text-xs uppercase text-accent/80 font-bold mb-3 px-3 tracking-widest">
            Management
          </h3>
          <div className="space-y-1">
            <NavLink to="/management/dashboard" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>💼</span> Dashboard
            </NavLink>
            <NavLink to="/projects-overview" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>🏗️</span> Projects
            </NavLink>
            <NavLink to="/management/quotations" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>📜</span> Quotations
            </NavLink>
            <NavLink to="/management/analytics" className={({ isActive }) => `block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive ? "bg-accent text-primary font-bold shadow-md transform translate-x-1" : "hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
              <span>📈</span> Analytics
            </NavLink>
          </div>
        </div>

      </nav>

      <div className="p-4 border-t border-white/10 mx-4 text-xs text-center text-white/40">
        &copy; 2026 Scaffoldz Inc.
      </div>
    </div>
  );
}

export default Sidebar;
