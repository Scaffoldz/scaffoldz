import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const Timeline = () => {
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

    // Mock timeline stages
    const stages = [
        { id: 1, name: 'Project Initiation', date: project.timelineStart, completed: true },
        { id: 2, name: 'Foundation Work', date: '2024-03-15', completed: project.progressPercentage >= 20 },
        { id: 3, name: 'Structural Frame', date: '2024-07-20', completed: project.progressPercentage >= 50 },
        { id: 4, name: 'Finishing', date: '2024-11-10', completed: project.progressPercentage >= 80 },
        { id: 5, name: 'Handover', date: project.timelineEnd, completed: project.progressPercentage === 100 },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Project Timeline</h2>

            <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-8">
                {stages.map((stage) => (
                    <div key={stage.id} className="relative pl-8">
                        <div className={`absolute -left-[9px] top-1 bg-white`}>
                            {stage.completed ?
                                <CheckCircle2 className="text-green-500" size={20} /> :
                                <Circle className="text-gray-300" size={20} />
                            }
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${stage.completed ? 'text-gray-900' : 'text-gray-500'}`}>{stage.name}</h3>
                            <p className="text-sm text-gray-400">{stage.date}</p>
                            <p className="mt-1 text-gray-600">{stage.completed ? 'Completed' : 'Pending'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
