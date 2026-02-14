import { useState, useEffect } from 'react';
import { api, ROLES } from '../../services/api';
import ProjectCard from '../../components/ProjectCard';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Plus } from 'lucide-react';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await api.getProjects(ROLES.CUSTOMER, user.id);
            setProjects(data);
            setLoading(false);
        };
        fetchProjects();
    }, [user]);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
                    <p className="text-gray-500">Manage and track your construction requests</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus size={20} />
                    New Request
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No projects found. Start a new one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => (
                        <ProjectCard key={p.id} project={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
