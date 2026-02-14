import { Search, Bell } from 'lucide-react';
import { userProfile } from '../../data/dummyData';

export default function TopBar() {
    return (
        <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-10">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects, tasks, or ask your agent..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4 ml-6">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell size={20} />
                    {userProfile.notifications > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm">
                        <div className="font-medium text-gray-900">{userProfile.name}</div>
                        <div className="text-xs text-gray-500">{userProfile.role}</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
