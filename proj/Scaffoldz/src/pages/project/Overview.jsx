import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Loader2, MapPin, Calendar, User } from 'lucide-react';

const Overview = () => {
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
    if (!project) return <div className="p-10 text-center text-red-500">Project not found</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Project Details</h2>
                <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3">
                        <MapPin className="text-blue-500 mt-1" size={20} />
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Location</p>
                            <p className="text-gray-900">{project.location}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <User className="text-blue-500 mt-1" size={20} />
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Customer</p>
                            <p className="text-gray-900">{project.customerName}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <User className="text-orange-500 mt-1" size={20} />
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Contractor</p>
                            <p className="text-gray-900">{project.contractorName || 'Not Assigned'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Calendar className="text-green-500 mt-1" size={20} />
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Timeline</p>
                            <p className="text-gray-900">{project.timelineStart} - {project.timelineEnd}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Status</h2>
                <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                    <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                        <div className="text-3xl font-bold text-blue-600">{project.progressPercentage}%</div>
                    </div>
                    <p className="text-gray-500 font-medium mb-6">Completion</p>
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                        <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${project.progressPercentage}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-400">Status: <span className="text-gray-900 font-medium">{project.status}</span></p>
                </div>
            </div>
        </div>
    );
};

export default Overview;
