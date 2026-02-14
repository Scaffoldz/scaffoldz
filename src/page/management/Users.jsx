function Users() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">User Management</h1>
                <p className="text-gray-500 mt-1">Manage access for Customers and Contractors.</p>
            </div>

            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-6xl opacity-20">👥</span>
                <h3 className="text-xl font-bold text-gray-700">User Directory Placeholder</h3>
                <p className="text-gray-500 max-w-md">
                    Admin panel to add, remove, or update user permissions and roles.
                </p>
                <div className="w-full max-w-3xl h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 mt-6">
                    User Table (Name, Role, Status, Actions)
                </div>
            </div>
        </div>
    );
}

export default Users;
