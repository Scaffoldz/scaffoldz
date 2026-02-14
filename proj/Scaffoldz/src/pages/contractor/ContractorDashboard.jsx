import { useState, useEffect } from 'react';
import { api, ROLES } from '../../services/api';
import ProjectCard from '../../components/ProjectCard';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ContractorDashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await api.getProjects(ROLES.CONTRACTOR, user.id);
            setProjects(data);
            setLoading(false);
        };
        fetchProjects();
    }, [user]);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Assigned Projects</h1>
                <p className="text-gray-500">Daily updates and site management</p>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No active assignments yet.</p>
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

export default ContractorDashboard;
