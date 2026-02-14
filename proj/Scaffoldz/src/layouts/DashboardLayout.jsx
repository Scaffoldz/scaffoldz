import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 ml-64">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                </header>
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
