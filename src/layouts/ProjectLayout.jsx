import { Outlet, NavLink, useParams, Navigate } from "react-router-dom";

function ProjectLayout() {
  const { id } = useParams();
  const userRole = localStorage.getItem("userRole");

  // STRICT RULE: Only Contractors can see this layout
  if (userRole !== "contractor") {
    return <Navigate to="/login" replace />;
  }

  const links = [
    { to: "overview", label: "Overview", icon: "📑" },
    { to: "budget", label: "Budget & Costs", icon: "💰" },
    { to: "timeline", label: "Timeline", icon: "📅" },
    { to: "reports", label: "Daily Reports", icon: "📋" },
    { to: "payments", label: "Payments", icon: "💳" },
    { to: "updates", label: "Site Updates", icon: "📢" },
    { to: "attendance", label: "Labour Attendance", icon: "👷" },
    { to: "materials", label: "Material Log", icon: "🧱" },
    { to: "notes", label: "Notes & Docs", icon: "📝" },
  ];

  return (
    <div className="flex h-full gap-6 animate-fade-in px-2">

      {/* Inner Sidebar - Contractor Specific */}
      <aside className="w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-6">
          <div className="bg-primary/5 p-4 border-b border-primary/10">
            <h2 className="font-bold text-primary">Project #{id}</h2>
            <p className="text-xs text-gray-500">Sushma Grande Towers</p>
          </div>
          <nav className="p-2 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-primary"}`}
              >
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

    </div>
  );
}

export default ProjectLayout;
