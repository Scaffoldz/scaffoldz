import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';
import { ExternalLink, Edit } from 'lucide-react';

export default function ProjectCard({ project }) {
    return (
        <div className="card group">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <StatusBadge status={project.status} />
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

            <ProgressBar progress={project.progress} />

            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                    <span>{project.completedTasks}/{project.tasks} tasks</span>
                </div>

                <div className="flex gap-2">
                    <Link
                        to={`/projects/${project.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-button transition-colors"
                    >
                        <ExternalLink size={14} />
                        <span>Open</span>
                    </Link>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-button transition-colors">
                        <Edit size={14} />
                        <span>Edit</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
