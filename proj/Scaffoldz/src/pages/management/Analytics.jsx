import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import { Loader2, DollarSign, Activity, Users, TrendingUp } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await api.getStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Financial & Project Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Total Projects" value={stats.totalProjects} icon={Activity} color="blue" />
                <StatsCard title="Total Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(0)}k`} icon={DollarSign} color="green" />
                <StatsCard title="Total Cost" value={`$${(stats.totalCost / 1000).toFixed(0)}k`} icon={DollarSign} color="orange" />
                <StatsCard title="Net Profit" value={`$${((stats.totalRevenue - stats.totalCost) / 1000).toFixed(0)}k`} icon={TrendingUp} color="purple" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Distribution</h3>
                <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                    Chart Placeholder (Chart.js / Recharts would go here)
                </div>
            </div>
        </div>
    );
};

export default Analytics;
