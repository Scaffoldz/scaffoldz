import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { projects } from '../data/dummyData';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import Timeline from '../components/ui/Timeline';
import { useState } from 'react';

export default function ProjectDetail() {
    const { id } = useParams();
    const project = projects.find(p => p.id === parseInt(id));
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Design homepage mockup', completed: true },
        { id: 2, title: 'Implement navigation', completed: true },
        { id: 3, title: 'Create responsive layout', completed: false },
        { id: 4, title: 'Add animations', completed: false },
    ]);

    if (!project) {
        return <div>Project not found</div>;
    }

    const toggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    return (
        <div>
            {/* Back button */}
            <Link to="/projects" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm">
                <ArrowLeft size={16} />
                <span>Back to Projects</span>
            </Link>

            {/* Project header */}
            <div className="card mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                        <p className="text-gray-600">{project.description}</p>
                    </div>
                    <StatusBadge status={project.status} />
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Due Date</div>
                            <div className="font-medium text-gray-900">{project.dueDate}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Users size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Team Size</div>
                            <div className="font-medium text-gray-900">5 members</div>
                        </div>
                    </div>
                    <div>
                        <ProgressBar progress={project.progress} />
                    </div>
                </div>
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content - Left side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tasks */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h3>
                        <div className="space-y-2">
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                        className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                    />
                                    <span className={`flex-1 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                        {task.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows="6"
                            placeholder="Add project notes..."
                            defaultValue="Meeting with client scheduled for next week. Need to finalize design before development sprint."
                        />
                    </div>
                </div>

                {/* Timeline - Right side (fixed on scroll) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Timeline</h3>
                            <Timeline events={project.timeline} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
