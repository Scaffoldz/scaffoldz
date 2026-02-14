import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Bot, Settings } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Agent', path: '/agent', icon: Bot },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AI</span>
                </div>
                <span className="ml-3 font-semibold text-gray-900">Agent Dashboard</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    v1.0.0 • © 2026
                </div>
            </div>
        </aside>
    );
}
