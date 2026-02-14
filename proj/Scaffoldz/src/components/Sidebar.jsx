import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, FileText, PieChart, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { user, logout, ROLES } = useAuth();
    const location = useLocation();

    const getLinks = () => {
        switch (user?.role) {
            case ROLES.MANAGEMENT:
                return [
                    { path: '/management', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
                    { path: '/management/quotations', label: 'Quotations', icon: <FileText size={20} /> },
                    { path: '/management/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
                ];
            case ROLES.CONTRACTOR:
                return [
                    { path: '/contractor', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
                ];
            case ROLES.CUSTOMER:
                return [
                    { path: '/customer', label: 'My Projects', icon: <FolderKanban size={20} /> },
                ];
            default:
                return [];
        }
    };

    const links = getLinks();

    return (
        <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-blue-500">Scaffoldz</h1>
                <p className="text-sm text-gray-400 mt-1 capitalize">{user?.role}</p>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === link.path || location.pathname.startsWith(link.path + '/') && link.path !== '/'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
