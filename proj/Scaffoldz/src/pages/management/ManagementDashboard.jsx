import { useState, useEffect } from 'react';
import { api, ROLES } from '../../services/api';
import ProjectCard from '../../components/ProjectCard';
import StatsCard from '../../components/StatsCard';
import { Loader2, DollarSign, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagementDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [pData, sData] = await Promise.all([
                api.getProjects(ROLES.MANAGEMENT),
                api.getStats()
            ]);
            setProjects(pData);
            setStats(sData);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    const pendingRequests = projects.filter(p => p.status === 'Request');
    const activeProjects = projects.filter(p => p.status === 'In Progress');

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Projects" value={stats.totalProjects} icon={Activity} color="blue" />
                <StatsCard title="Total Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(0)}k`} icon={DollarSign} color="green" />
                <StatsCard title="Total Cost" value={`$${(stats.totalCost / 1000).toFixed(0)}k`} icon={DollarSign} color="orange" />
                <StatsCard title="Active Contractors" value={stats.activeContractors} icon={Users} color="purple" />
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">New Project Requests</h2>
                        <Link to="/management/quotations" className="text-blue-600 text-sm hover:underline">View Quotations</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingRequests.map(p => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                </div>
            )}

            {/* Active Projects */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">On-going Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeProjects.map(p => (
                        <ProjectCard key={p.id} project={p} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManagementDashboard;
