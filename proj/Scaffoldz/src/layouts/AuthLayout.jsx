import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-6 text-center">
                    <h1 className="text-3xl font-bold text-white">Scaffoldz</h1>
                    <p className="text-blue-100 mt-2">Construction Project Management</p>
                </div>
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
            <p className="mt-8 text-gray-400 text-sm">&copy; 2026 Scaffoldz Inc.</p>
        </div>
    );
};

export default AuthLayout;
