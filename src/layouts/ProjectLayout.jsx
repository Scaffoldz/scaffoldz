import { Outlet, NavLink, useParams, Navigate } from "react-router-dom";

function ProjectLayout() {
  const { id } = useParams();
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Sidebar links based on role
  let links = [];

  if (userRole === "customer" || userRole === "management") {
    // Management sees what Customer sees (Read-only logic handled in components)
    links = [
      { to: "overview", label: "Overview" },
      { to: "timeline", label: "Track Progress" },
      { to: "budget", label: "Budget Analysis" },
      { to: "payments", label: "Payments" },
      { to: "3d-view", label: "3D View" }, // Placeholder route
      { to: "messages", label: "Messages" }, // Placeholder route
    ];
  } else if (userRole === "contractor") {
    links = [
      { to: "overview", label: "Work Details" }, // Reusing overview or creating specific
      { to: "labour-management", label: "Labour Management" }, // Placeholder
      { to: "upload-photos", label: "Upload Photos" }, // Placeholder
      { to: "contact-client", label: "Message Client" }, // Placeholder
    ];
  }

  return (
    <div className="flex h-full gap-6 animate-fade-in px-4 py-6 max-w-7xl mx-auto">

      {/* Inner Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
          <div className="bg-primary p-4 text-white">
            <h2 className="font-bold text-lg">Project #{id}</h2>
            <p className="text-xs opacity-80">Sushma Grande Towers</p>
          </div>
          <nav className="p-2 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `block px-4 py-2.5 rounded-md text-sm font-medium transition-all ${isActive ? "bg-accent/20 text-primary font-bold border-l-4 border-primary" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <NavLink to={`/${userRole}/dashboard`} className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
              ← Back to Dashboard
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default ProjectLayout;
