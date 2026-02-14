import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Loader2, DollarSign, PieChart } from 'lucide-react';

const Budget = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const data = await api.getProjectById(id);
            setProject(data);
            setLoading(false);
        };
        fetchProject();
    }, [id]);

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    const remaining = project.totalBudget - project.spentAmount;
    const spentPercent = (project.spentAmount / project.totalBudget) * 100;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <DollarSign size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Budget Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900">${project.totalBudget.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-red-100">
                    <p className="text-sm text-red-500 mb-1">Spent Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${project.spentAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-green-100">
                    <p className="text-sm text-green-500 mb-1">Remaining</p>
                    <p className="text-2xl font-bold text-gray-900">${remaining.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Utilization</h3>
                <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
                    <div
                        className={`h-4 rounded-full transition-all duration-1000 ${spentPercent > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${spentPercent}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>0%</span>
                    <span>{spentPercent.toFixed(1)}% Used</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
};

export default Budget;
