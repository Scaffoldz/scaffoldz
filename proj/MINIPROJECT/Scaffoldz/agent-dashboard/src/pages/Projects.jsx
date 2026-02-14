import { Plus } from 'lucide-react';
import { projects } from '../data/dummyData';
import ProjectCard from '../components/ui/ProjectCard';

export default function Projects() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
                    <p className="text-gray-600">Manage and track all your projects in one place.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    <span>New Project</span>
                </button>
            </div>

            {/* Filter/Sort options */}
            <div className="mb-6 flex gap-3">
                <button className="px-4 py-2 bg-primary-50 text-primary-700 rounded-button font-medium text-sm">
                    All Projects
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-button text-sm">
                    Active
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-button text-sm">
                    Paused
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-button text-sm">
                    Completed
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}
