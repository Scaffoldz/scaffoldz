import { Outlet, NavLink, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const ProjectLayout = () => {
    const { id } = useParams();
    const { user, ROLES } = useAuth();

    if (!user) return null;

    const tabs = [
        { name: 'Overview', path: '' },
        { name: 'Budget', path: 'budget' },
        { name: 'Timeline', path: 'timeline' },
        { name: 'Reports', path: 'reports' },
    ];

    if (user.role === ROLES.MANAGEMENT) {
        tabs.push({ name: 'Internal Notes', path: 'notes' });
    }

    if (user.role === ROLES.CONTRACTOR) {
        tabs.push(
            { name: 'Updates', path: 'updates' },
            { name: 'Attendance', path: 'attendance' },
            { name: 'Materials', path: 'materials' }
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Project #{id}</h1>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            end={tab.path === ''}
                            className={({ isActive }) =>
                                `whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${isActive
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                            }
                        >
                            {tab.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 min-h-[400px] p-6 shadow-sm">
                <Outlet />
            </div>
        </div>
    );
};

export default ProjectLayout;
